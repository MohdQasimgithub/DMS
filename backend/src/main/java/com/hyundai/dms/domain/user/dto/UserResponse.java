package com.hyundai.dms.domain.user.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private boolean active;
    private boolean accountLocked;
    private int failedLoginAttempts;
    private LocalDateTime lastLoginAt;
    private Set<String> roles;
    private Long dealerId;
    private String dealerName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
}
