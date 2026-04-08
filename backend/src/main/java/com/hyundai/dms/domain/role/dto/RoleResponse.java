package com.hyundai.dms.domain.role.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoleResponse {
    private Long id;
    private String roleName;
    private String description;
    private boolean active;
    private List<MenuSummary> menus;
    private String createdBy;
    private LocalDateTime createdAt;

    @Data
    public static class MenuSummary {
        private Long id;
        private String menuCode;
        private String menuName;
        private String url;
    }
}
