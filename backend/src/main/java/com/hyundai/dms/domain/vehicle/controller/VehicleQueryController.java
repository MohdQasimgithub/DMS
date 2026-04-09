package com.hyundai.dms.domain.vehicle.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.vehicle.dto.VehicleResponse;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import com.hyundai.dms.domain.vehicle.service.VehicleQueryService;
import com.hyundai.dms.domain.vehicle.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

/**
 * Demonstrates QueryDSL dynamic predicate-based filtering.
 */
@RestController
@RequestMapping("/v1/vehicles/query")
@RequiredArgsConstructor
@Tag(name = "Vehicle Advanced Query (QueryDSL)")
public class VehicleQueryController {

    private final VehicleQueryService vehicleQueryService;
    private final VehicleService vehicleService;

    @GetMapping
    @Operation(summary = "Advanced vehicle filter using QueryDSL BooleanBuilder")
    public ResponseEntity<ApiResponse<PageResponse<VehicleResponse>>> advancedSearch(
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Vehicle> result = vehicleQueryService.findByDynamicFilter(
                model, status, yearFrom, yearTo, PageRequest.of(page, size));

        // reuse toResponse via service
        PageResponse<VehicleResponse> response = PageResponse.<VehicleResponse>builder()
                .content(result.getContent().stream()
                        .map(v -> vehicleService.getById(v.getId()))
                        .collect(Collectors.toList()))
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
