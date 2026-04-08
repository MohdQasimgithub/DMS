package com.hyundai.dms.domain.role.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class RoleRequest {

    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 50)
    private String roleName;

    @Size(max = 200)
    private String description;

    private Set<Long> menuIds;
}
