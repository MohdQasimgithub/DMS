package com.hyundai.dms.domain.loginhistory.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.loginhistory.entity.LoginHistory;
import com.hyundai.dms.domain.loginhistory.repository.LoginHistoryRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/login-history")
@RequiredArgsConstructor
@Tag(name = "Login History")
public class LoginHistoryController {

    private final LoginHistoryRepository loginHistoryRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<LoginHistory>>> getHistory(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) LoginHistory.LoginStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String statusStr = status != null ? status.name() : null;
        var result = loginHistoryRepository.search(search, statusStr,
                PageRequest.of(page, size, Sort.by("loginTime").descending()));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }
}
