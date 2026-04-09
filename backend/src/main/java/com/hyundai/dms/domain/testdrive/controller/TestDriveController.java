package com.hyundai.dms.domain.testdrive.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.testdrive.dto.TestDriveRequest;
import com.hyundai.dms.domain.testdrive.dto.TestDriveResponse;
import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import com.hyundai.dms.domain.testdrive.service.TestDriveService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/test-drives")
@RequiredArgsConstructor
@Tag(name = "Test Drive Management")
public class TestDriveController {

    private final TestDriveService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TestDriveResponse>>> search(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) TestDrive.TestDriveStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "scheduledDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(ApiResponse.success(
                service.search(search, status, PageRequest.of(page, size, sort))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestDriveResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestDriveResponse>> create(@Valid @RequestBody TestDriveRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Test drive booked", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DEALER','EMPLOYEE')")
    public ResponseEntity<ApiResponse<TestDriveResponse>> update(@PathVariable Long id,
                                                                  @Valid @RequestBody TestDriveRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Test drive updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DEALER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Test drive cancelled", null));
    }
}
