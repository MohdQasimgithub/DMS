package com.hyundai.dms.domain.auditlog.service;

import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import com.hyundai.dms.domain.auditlog.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log an action performed by the currently authenticated user.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(AuditLog.AuditAction action, String description,
                    String targetEntity, String targetId) {
        try {
            String username = "SYSTEM";
            String roles = "";

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                username = auth.getName();
                roles = auth.getAuthorities().stream()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .reduce((a, b) -> a + ", " + b).orElse("");
            }

            auditLogRepository.save(AuditLog.builder()
                    .username(username)
                    .roles(roles)
                    .action(action)
                    .description(description)
                    .targetEntity(targetEntity)
                    .targetId(targetId)
                    .ipAddress(getClientIp())
                    .timestamp(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            log.warn("Failed to save audit log: {}", e.getMessage());
        }
    }

    /**
     * Log an action with explicit username (used for login/logout before auth context is set).
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logWithUser(String username, String roles, AuditLog.AuditAction action,
                             String description, String targetEntity, String targetId) {
        try {
            auditLogRepository.save(AuditLog.builder()
                    .username(username)
                    .roles(roles)
                    .action(action)
                    .description(description)
                    .targetEntity(targetEntity)
                    .targetId(targetId)
                    .ipAddress(getClientIp())
                    .timestamp(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            log.warn("Failed to save audit log: {}", e.getMessage());
        }
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest req = attrs.getRequest();
                String ip = req.getHeader("X-Forwarded-For");
                return (ip != null && !ip.isEmpty()) ? ip.split(",")[0].trim() : req.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "unknown";
    }
}
