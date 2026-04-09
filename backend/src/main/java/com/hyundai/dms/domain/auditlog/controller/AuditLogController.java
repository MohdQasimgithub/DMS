package com.hyundai.dms.domain.auditlog.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import com.hyundai.dms.domain.auditlog.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Log")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) AuditLog.AuditAction action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String actionStr = action != null ? action.name() : null;
        var result = auditLogRepository.search(search, actionStr, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }
}
