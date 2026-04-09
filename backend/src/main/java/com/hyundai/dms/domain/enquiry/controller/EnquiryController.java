package com.hyundai.dms.domain.enquiry.controller;

import com.hyundai.dms.common.response.ApiResponse;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.enquiry.dto.EnquiryRequest;
import com.hyundai.dms.domain.enquiry.dto.EnquiryResponse;
import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import com.hyundai.dms.domain.enquiry.service.EnquiryService;
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
@RequestMapping("/v1/enquiries")
@RequiredArgsConstructor
@Tag(name = "Enquiry Management")
public class EnquiryController {

    private final EnquiryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EnquiryResponse>>> search(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Enquiry.EnquiryStatus status,
            @RequestParam(required = false) Enquiry.EnquiryType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(ApiResponse.success(
                service.search(search, status, type, PageRequest.of(page, size, sort))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EnquiryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EnquiryResponse>> create(@Valid @RequestBody EnquiryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enquiry submitted", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DEALER','EMPLOYEE')")
    public ResponseEntity<ApiResponse<EnquiryResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody EnquiryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Enquiry updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DEALER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Enquiry closed", null));
    }
}
