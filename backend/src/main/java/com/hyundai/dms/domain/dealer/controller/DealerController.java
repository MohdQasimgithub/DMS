package com.hyundai.dms.domain.dealer.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.dto.DealerRequest;
import com.hyundai.dms.domain.dealer.dto.DealerResponse;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.service.DealerService;
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
@RequestMapping("/v1/dealers")
@RequiredArgsConstructor
@Tag(name = "Dealer Management")
public class DealerController {

    private final DealerService dealerService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DealerResponse>>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Dealer.DealerStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dealerName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(ApiResponse.success(dealerService.getAll(search, status, PageRequest.of(page, size, sort))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DealerResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dealerService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DealerResponse>> create(@Valid @RequestBody DealerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dealer created", dealerService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DealerResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody DealerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Dealer updated", dealerService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        dealerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Dealer deactivated", null));
    }

    // Dynamic dropdown endpoints
    @GetMapping("/dropdown/regions")
    public ResponseEntity<ApiResponse<List<String>>> getRegions() {
        return ResponseEntity.ok(ApiResponse.success(dealerService.getRegions()));
    }

    @GetMapping("/dropdown/by-region")
    public ResponseEntity<ApiResponse<List<DealerResponse>>> getByRegion(@RequestParam String region) {
        return ResponseEntity.ok(ApiResponse.success(dealerService.getActiveByRegion(region)));
    }
}
