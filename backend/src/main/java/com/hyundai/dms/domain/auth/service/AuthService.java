package com.hyundai.dms.domain.auth.service;

import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import com.hyundai.dms.domain.auditlog.service.AuditLogService;
import com.hyundai.dms.common.exception.BusinessException;
import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.domain.auth.dto.AuthResponse;
import com.hyundai.dms.domain.auth.dto.LoginRequest;
import com.hyundai.dms.domain.auth.dto.RegisterRequest;
import com.hyundai.dms.domain.loginhistory.entity.LoginHistory;
import com.hyundai.dms.domain.loginhistory.repository.LoginHistoryRepository;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import com.hyundai.dms.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginHistoryRepository loginHistoryRepository;
    private final AuditLogService auditLogService;

    @Value("${app.max-login-attempts}")
    private int maxLoginAttempts;

    @Value("${app.lock-duration-minutes:1}")
    private int lockDurationMinutes;

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest req = attrs.getRequest();
                String ip = req.getHeader("X-Forwarded-For");
                return (ip != null && !ip.isEmpty()) ? ip.split(",")[0].trim() : req.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "unknown";
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Passwords do not match");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Resolve selected role — default to EMPLOYEE if not provided
        String roleName = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase()
                : "EMPLOYEE";

        // Only DEALER and EMPLOYEE allowed for self-registration
        if ("ADMIN".equals(roleName)) {
            throw new BusinessException("Admin accounts cannot be self-registered. Contact system administrator.");
        }

        Role assignedRole = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new BusinessException("Role not found: " + roleName));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .roles(Set.of(assignedRole))
                .build();

        userRepository.save(user);
        log.info("New user registered: {} with role: {}", user.getUsername(), roleName);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        return AuthResponse.builder()
                .accessToken(tokenProvider.generateToken(authentication))
                .refreshToken(tokenProvider.generateRefreshToken(user.getUsername()))
                .tokenType("Bearer")
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(Set.of(assignedRole.getRoleName()))
                .dealerId(user.getDealer() != null ? user.getDealer().getId() : null)
                .dealerName(user.getDealer() != null ? user.getDealer().getDealerName() : null)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Check if account is locked and handle auto-unlock
        if (user.isAccountLocked()) {
            checkAndUnlockAccount(user);
            
            // Re-check after potential unlock
            if (user.isAccountLocked()) {
                long remainingSeconds = getRemainingLockSeconds(user);
                log.warn("Login attempt for locked account '{}'. Remaining lock time: {} seconds", 
                        user.getUsername(), remainingSeconds);
                throw new LockedException(
                    String.format("Account locked. Try again after %d seconds.", remainingSeconds)
                );
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Reset failed attempts on success
            userRepository.resetFailedAttempts(user.getUsername());
            user.setLastLoginAt(LocalDateTime.now());
            user.setFailedLoginAttempts(0);
            user.setAccountLocked(false);
            user.setLockTime(null);
            userRepository.save(user);

            String accessToken = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

            log.info("User '{}' logged in successfully", user.getUsername());

            // Record login history + audit log
            loginHistoryRepository.save(LoginHistory.builder()
                    .username(user.getUsername())
                    .roles(user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining(", ")))
                    .loginTime(LocalDateTime.now())
                    .ipAddress(getClientIp())
                    .status(LoginHistory.LoginStatus.SUCCESS)
                    .build());

            auditLogService.logWithUser(user.getUsername(),
                    user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining(", ")),
                    AuditLog.AuditAction.LOGIN,
                    "User logged in successfully",
                    "User", user.getUsername());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .roles(user.getRoles().stream()
                            .map(r -> r.getRoleName())
                            .collect(Collectors.toSet()))
                    .dealerId(user.getDealer() != null ? user.getDealer().getId() : null)
                    .dealerName(user.getDealer() != null ? user.getDealer().getDealerName() : null)
                    .build();

        } catch (BadCredentialsException ex) {
            handleFailedLogin(user);
            throw ex;
        }
    }

    private void handleFailedLogin(User user) {
        userRepository.incrementFailedAttempts(user.getUsername());
        int attempts = user.getFailedLoginAttempts() + 1;
        int remaining = maxLoginAttempts - attempts;
        log.warn("Failed login attempt {} for user '{}'", attempts, user.getUsername());

        boolean willLock = attempts >= maxLoginAttempts;

        // Record failed login history + audit
        loginHistoryRepository.save(LoginHistory.builder()
                .username(user.getUsername())
                .roles(user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining(", ")))
                .loginTime(LocalDateTime.now())
                .ipAddress(getClientIp())
                .status(willLock ? LoginHistory.LoginStatus.LOCKED : LoginHistory.LoginStatus.FAILED)
                .failureReason(willLock ? "Account locked after " + attempts + " failed attempts" : "Invalid password (attempt " + attempts + ")")
                .build());

        auditLogService.logWithUser(user.getUsername(),
                user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining(", ")),
                willLock ? AuditLog.AuditAction.ACCOUNT_LOCKED : AuditLog.AuditAction.LOGIN_FAILED,
                willLock ? "Account locked after " + attempts + " failed attempts"
                         : "Failed login attempt " + attempts,
                "User", user.getUsername());

        if (willLock) {
            LocalDateTime lockTime = LocalDateTime.now();
            userRepository.lockAccount(user.getUsername(), lockTime);
            log.warn("Account '{}' locked at {} after {} failed attempts", user.getUsername(), lockTime, attempts);
            throw new LockedException(
                String.format("Account locked after %d failed attempts. Try again after %d minute(s).", 
                    maxLoginAttempts, lockDurationMinutes)
            );
        } else {
            // Throw exception with remaining attempts info
            throw new BadCredentialsException(
                String.format("Invalid credentials. You have %d out of %d attempts remaining.", remaining, maxLoginAttempts)
            );
        }
    }

    /**
     * Check if account should be automatically unlocked based on lock duration
     * If lock time has passed, unlock the account
     */
    @Transactional
    public void checkAndUnlockAccount(User user) {
        if (!user.isAccountLocked() || user.getLockTime() == null) {
            return;
        }

        LocalDateTime unlockTime = user.getLockTime().plusMinutes(lockDurationMinutes);
        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(unlockTime)) {
            userRepository.unlockAccount(user.getUsername());
            user.setAccountLocked(false);
            user.setLockTime(null);
            user.setFailedLoginAttempts(0);
            
            log.info("Account '{}' automatically unlocked after {} minute(s)", user.getUsername(), lockDurationMinutes);
            
            auditLogService.logWithUser(user.getUsername(),
                    user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining(", ")),
                    AuditLog.AuditAction.USER_UNLOCKED,
                    String.format("Account automatically unlocked after %d minute(s)", lockDurationMinutes),
                    "User", user.getUsername());
        }
    }

    /**
     * Get remaining lock time in seconds for a locked account
     */
    public long getRemainingLockSeconds(User user) {
        if (!user.isAccountLocked() || user.getLockTime() == null) {
            return 0;
        }

        LocalDateTime unlockTime = user.getLockTime().plusMinutes(lockDurationMinutes);
        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(unlockTime)) {
            return 0;
        }

        return java.time.Duration.between(now, unlockTime).getSeconds();
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token");
        }
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, null,
                user.getRoles().stream()
                        .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + r.getRoleName()))
                        .collect(Collectors.toSet())
        );

        return AuthResponse.builder()
                .accessToken(tokenProvider.generateToken(auth))
                .refreshToken(tokenProvider.generateRefreshToken(username))
                .tokenType("Bearer")
                .username(username)
                .build();
    }

    /**
     * Get remaining login attempts for a username
     * Returns the number of remaining attempts (max - current failed attempts)
     * If user doesn't exist or is locked, returns 0
     */
    @Transactional(readOnly = true)
    public int getRemainingAttempts(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return maxLoginAttempts; // Username doesn't exist yet, show max attempts
        }
        if (user.isAccountLocked()) {
            return 0; // Account locked, no attempts remaining
        }
        return Math.max(0, maxLoginAttempts - user.getFailedLoginAttempts());
    }

    /**
     * Get detailed login attempt status including lock information
     * Used by frontend to display remaining attempts and lock countdown
     */
    @Transactional
    public LoginAttemptStatus getLoginAttemptStatus(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null) {
            return LoginAttemptStatus.builder()
                    .remainingAttempts(maxLoginAttempts)
                    .accountLocked(false)
                    .remainingLockSeconds(0L)
                    .build();
        }

        // Check for auto-unlock
        if (user.isAccountLocked()) {
            checkAndUnlockAccount(user);
            // Refresh user state after potential unlock
            user = userRepository.findByUsername(username).orElse(user);
        }

        int remaining = user.isAccountLocked() ? 0 : Math.max(0, maxLoginAttempts - user.getFailedLoginAttempts());
        long lockSeconds = user.isAccountLocked() ? getRemainingLockSeconds(user) : 0;

        return LoginAttemptStatus.builder()
                .remainingAttempts(remaining)
                .accountLocked(user.isAccountLocked())
                .remainingLockSeconds(lockSeconds)
                .build();
    }

    /**
     * DTO for login attempt status
     */
    @lombok.Data
    @lombok.Builder
    public static class LoginAttemptStatus {
        private Integer remainingAttempts;
        private Boolean accountLocked;
        private Long remainingLockSeconds;
    }
}
