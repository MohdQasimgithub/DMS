package com.hyundai.dms.domain.auth.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.domain.auth.dto.AuthResponse;
import com.hyundai.dms.domain.auth.dto.LoginRequest;
import com.hyundai.dms.domain.auth.dto.RegisterRequest;
import com.hyundai.dms.domain.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, logout, token refresh")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request)));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", authService.register(request)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(ApiResponse.success(authService.refreshToken(refreshToken)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (client-side token invalidation)")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // JWT is stateless; client discards token
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
