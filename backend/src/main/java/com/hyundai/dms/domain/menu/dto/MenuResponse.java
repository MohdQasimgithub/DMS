package com.hyundai.dms.domain.menu.dto;

import lombok.Data;

import java.util.List;

@Data
public class MenuResponse {
    private Long id;
    private String menuCode;
    private String menuName;
    private String url;
    private String icon;
    private Integer sortOrder;
    private boolean active;
    private Long parentId;
    private List<MenuResponse> children;
}
