package com.hyundai.dms.domain.auth.service;

import com.hyundai.dms.common.exception.BusinessException;
import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.domain.auth.dto.AuthResponse;
import com.hyundai.dms.domain.auth.dto.LoginRequest;
import com.hyundai.dms.domain.auth.dto.RegisterRequest;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import com.hyundai.dms.security.jwt.JwtTokenProvider;
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

    @Value("${app.max-login-attempts}")
    private int maxLoginAttempts;

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
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.isAccountLocked()) {
            throw new LockedException("Account is locked");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Reset failed attempts on success
            userRepository.resetFailedAttempts(user.getUsername());
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            String accessToken = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

            log.info("User '{}' logged in successfully", user.getUsername());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .roles(user.getRoles().stream()
                            .map(r -> r.getRoleName())
                            .collect(Collectors.toSet()))
                    .build();

        } catch (BadCredentialsException ex) {
            handleFailedLogin(user);
            throw ex;
        }
    }

    private void handleFailedLogin(User user) {
        userRepository.incrementFailedAttempts(user.getUsername());
        int attempts = user.getFailedLoginAttempts() + 1;
        log.warn("Failed login attempt {} for user '{}'", attempts, user.getUsername());

        if (attempts >= maxLoginAttempts) {
            userRepository.lockAccount(user.getUsername());
            log.warn("Account '{}' locked after {} failed attempts", user.getUsername(), attempts);
            throw new LockedException("Account locked after " + maxLoginAttempts + " failed attempts");
        }
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
}
