package com.hyundai.dms.domain.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MenuRequest {

    @NotBlank(message = "Menu code is required")
    @Size(max = 50)
    private String menuCode;

    @NotBlank(message = "Menu name is required")
    @Size(max = 100)
    private String menuName;

    @Size(max = 200)
    private String url;

    @Size(max = 50)
    private String icon;

    private Integer sortOrder;

    private Long parentId;
}
