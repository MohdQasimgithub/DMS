package com.hyundai.dms.domain.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String username;
    private String fullName;
    private Set<String> roles;
}
