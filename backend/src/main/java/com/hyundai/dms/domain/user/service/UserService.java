package com.hyundai.dms.domain.user.service;

import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import com.hyundai.dms.domain.auditlog.service.AuditLogService;
import com.hyundai.dms.common.exception.BusinessException;
import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.user.dto.UserRequest;
import com.hyundai.dms.domain.user.dto.UserResponse;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAll(String search, Pageable pageable) {
        return PageResponse.of(userRepository.search(search, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public UserResponse create(UserRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin  = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDealer = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEALER"));

        // ── Role hierarchy enforcement ────────────────────────────────────────
        if (isDealer && !isAdmin) {
            // Dealer can only create EMPLOYEE accounts
            if (request.getRoleIds() != null) {
                for (Long roleId : request.getRoleIds()) {
                    Role role = roleRepository.findById(roleId)
                            .orElseThrow(() -> new ResourceNotFoundException("Role", roleId));
                    if (!role.getRoleName().equals("EMPLOYEE")) {
                        throw new BusinessException("Dealers can only create Employee accounts.");
                    }
                }
            }
            // Auto-assign the dealer's own dealerId to the employee they create
            if (request.getDealerId() == null) {
                User dealerUser = userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new BusinessException("Dealer user not found"));
                if (dealerUser.getDealer() != null) {
                    request.setDealerId(dealerUser.getDealer().getId());
                }
            }
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        Set<Role> roles = resolveRoles(request.getRoleIds());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .roles(roles)
                .build();

        // Link to dealer if dealerId provided
        if (request.getDealerId() != null) {
            Dealer dealer = dealerRepository.findById(request.getDealerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dealer", request.getDealerId()));
            user.setDealer(dealer);
        }

        User saved = userRepository.save(user);
        log.info("Created user: {} linked to dealer: {}", saved.getUsername(),
                saved.getDealer() != null ? saved.getDealer().getDealerName() : "none");
        auditLogService.log(AuditLog.AuditAction.USER_CREATED,
                "New user created: " + saved.getUsername(), "User", saved.getUsername());
        return toResponse(saved);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public UserResponse update(Long id, UserRequest request) {
        User user = findById(id);

        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoleIds() != null) {
            user.setRoles(resolveRoles(request.getRoleIds()));
        }

        UserResponse result = toResponse(userRepository.save(user));
        auditLogService.log(AuditLog.AuditAction.USER_UPDATED,
                "User updated: " + user.getUsername(), "User", user.getUsername());
        return result;
    }

    @Transactional
    public void delete(Long id) {
        User user = findById(id);
        user.setActive(false);
        userRepository.save(user);
        log.info("Deactivated user: {}", user.getUsername());
        auditLogService.log(AuditLog.AuditAction.USER_DEACTIVATED,
                "User deactivated: " + user.getUsername(), "User", user.getUsername());
    }

    @Transactional
    public void unlockAccount(Long id) {
        User user = findById(id);
        user.setAccountLocked(false);
        user.resetFailedAttempts();
        userRepository.save(user);
        log.info("Unlocked account: {}", user.getUsername());
        auditLogService.log(AuditLog.AuditAction.USER_UNLOCKED,
                "Account unlocked: " + user.getUsername(), "User", user.getUsername());
    }

    /**
     * Sets or clears account expiry.
     * Expired accounts are rejected at login via CustomUserDetailsService.accountExpired().
     * Demonstrates the "Expire Account" security requirement.
     */
    @Transactional
    public void setAccountExpiry(Long id, String expireAt) {
        User user = findById(id);
        if (expireAt == null || expireAt.isBlank()) {
            user.setAccountExpiredAt(null); // clear expiry
        } else {
            user.setAccountExpiredAt(java.time.LocalDateTime.parse(expireAt));
        }
        userRepository.save(user);
        log.info("Account expiry set for user: {} -> {}", user.getUsername(), expireAt);
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private Set<Role> resolveRoles(Set<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) return new HashSet<>();
        return roleIds.stream()
                .map(rid -> roleRepository.findById(rid)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", rid)))
                .collect(Collectors.toSet());
    }

    private UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setFullName(user.getFullName());
        res.setPhoneNumber(user.getPhoneNumber());
        res.setActive(user.isActive());
        res.setAccountLocked(user.isAccountLocked());
        res.setFailedLoginAttempts(user.getFailedLoginAttempts());
        res.setLastLoginAt(user.getLastLoginAt());
        res.setRoles(user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toSet()));
        if (user.getDealer() != null) {
            res.setDealerId(user.getDealer().getId());
            res.setDealerName(user.getDealer().getDealerName());
        }
        res.setCreatedBy(user.getCreatedBy());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedBy(user.getUpdatedBy());
        res.setUpdatedAt(user.getUpdatedAt());
        return res;
    }
}
