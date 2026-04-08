package com.hyundai.dms.domain.config.controller;

import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.domain.config.entity.AppConfig;
import com.hyundai.dms.domain.config.repository.AppConfigRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/configs")
@RequiredArgsConstructor
@Tag(name = "App Configuration")
public class AppConfigController {

    private final AppConfigRepository configRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppConfig>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(configRepository.findAll()));
    }

    @GetMapping("/group/{group}")
    public ResponseEntity<ApiResponse<List<AppConfig>>> getByGroup(@PathVariable String group) {
        return ResponseEntity.ok(ApiResponse.success(configRepository.findByConfigGroup(group)));
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<ApiResponse<AppConfig>> getByKey(@PathVariable String key) {
        AppConfig config = configRepository.findByConfigKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Config key not found: " + key));
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppConfig>> update(@PathVariable Long id,
                                                          @RequestParam String value) {
        AppConfig config = configRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Config", id));
        if (!config.isEditable()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("This config is not editable"));
        }
        config.setConfigValue(value);
        return ResponseEntity.ok(ApiResponse.success(configRepository.save(config)));
    }
}
