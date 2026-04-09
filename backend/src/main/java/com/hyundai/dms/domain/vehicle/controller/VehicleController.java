package com.hyundai.dms.domain.vehicle.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.vehicle.dto.VehicleRequest;
import com.hyundai.dms.domain.vehicle.dto.VehicleResponse;
import com.hyundai.dms.domain.vehicle.service.VehicleService;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
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
@RequestMapping("/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicle Management")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<VehicleResponse>>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Vehicle.VehicleStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "model") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getAll(search, status, PageRequest.of(page, size, sort))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VehicleResponse>> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vehicle created", vehicleService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VehicleResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated", vehicleService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle removed", null));
    }

    // Linked/Dynamic dropdowns
    @GetMapping("/dropdown/models")
    public ResponseEntity<ApiResponse<List<String>>> getModels() {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getModels()));
    }

    @GetMapping("/dropdown/variants")
    public ResponseEntity<ApiResponse<List<String>>> getVariants(@RequestParam String model) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVariantsByModel(model)));
    }

    @GetMapping("/dropdown/colors")
    public ResponseEntity<ApiResponse<List<String>>> getColors(@RequestParam String model,
                                                                @RequestParam String variant) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getColorsByModelAndVariant(model, variant)));
    }
}
