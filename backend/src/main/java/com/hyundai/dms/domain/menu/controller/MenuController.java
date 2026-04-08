package com.hyundai.dms.domain.menu.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.domain.menu.dto.MenuRequest;
import com.hyundai.dms.domain.menu.dto.MenuResponse;
import com.hyundai.dms.domain.menu.service.MenuService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/menus")
@RequiredArgsConstructor
@Tag(name = "Menu Management")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getTree() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getMenuTree()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponse>> create(@Valid @RequestBody MenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu created", menuService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponse>> update(@PathVariable Long id,
                                                             @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Menu updated", menuService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Menu deactivated", null));
    }
}
