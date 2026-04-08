package com.hyundai.dms.domain.role.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.role.dto.RoleRequest;
import com.hyundai.dms.domain.role.dto.RoleResponse;
import com.hyundai.dms.domain.role.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<RoleResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                roleService.getAll(PageRequest.of(page, size, Sort.by("roleName")))));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllActive()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roleService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> create(@Valid @RequestBody RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Role created", roleService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponse>> update(@PathVariable Long id,
                                                             @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Role updated", roleService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Role deactivated", null));
    }
}
