package com.hyundai.dms.domain.user.service;

import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.user.dto.UserRequest;
import com.hyundai.dms.domain.user.dto.UserResponse;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAll(Pageable pageable) {
        Page<UserResponse> page = userRepository.findAll(pageable).map(this::toResponse);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public UserResponse create(UserRequest request) {
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

        User saved = userRepository.save(user);
        log.info("Created user: {}", saved.getUsername());
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

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findById(id);
        user.setActive(false);
        userRepository.save(user);
        log.info("Deactivated user: {}", user.getUsername());
    }

    @Transactional
    public void unlockAccount(Long id) {
        User user = findById(id);
        user.setAccountLocked(false);
        user.resetFailedAttempts();
        userRepository.save(user);
        log.info("Unlocked account: {}", user.getUsername());
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
        res.setCreatedBy(user.getCreatedBy());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedBy(user.getUpdatedBy());
        res.setUpdatedAt(user.getUpdatedAt());
        return res;
    }
}
