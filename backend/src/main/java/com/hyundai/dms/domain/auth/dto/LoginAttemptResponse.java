package com.hyundai.dms.domain.auth.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for login attempt information
 * Used for both failed login attempts and account lock status
 */
@Data
@Builder
public class LoginAttemptResponse {
    private boolean success;
    private String message;
    private Integer remainingAttempts;
    private Boolean accountLocked;
    private Long remainingLockSeconds;
    private AuthResponse authData; // Only populated on successful login
}
