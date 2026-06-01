package com.hyundai.dms.domain.testdrive.service;

import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.testdrive.dto.TestDriveRequest;
import com.hyundai.dms.domain.testdrive.dto.TestDriveResponse;
import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import com.hyundai.dms.domain.testdrive.repository.TestDriveRepository;
import com.hyundai.dms.domain.user.repository.UserRepository;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestDriveService {

    private final TestDriveRepository testDriveRepository;
    private final VehicleRepository vehicleRepository;
    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;

    /**
     * ADMIN    → sees all test drives (dealerId = null)
     * DEALER   → sees only test drives for their dealership (dealerId = X)
     * EMPLOYEE → sees only their own bookings (ownerUsername = current username)
     */
    @Transactional(readOnly = true)
    public PageResponse<TestDriveResponse> search(String search, TestDrive.TestDriveStatus status, Pageable pageable) {
        String statusStr = status != null ? status.name() : null;
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDealer = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEALER"));
        boolean isEmployee = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));
        
        Long dealerId = null;
        String ownerUsername = null;
        
        // DEALER: Filter by their dealership
        if (isDealer && !isAdmin) {
            dealerId = userRepository.findDealerIdByUsername(auth.getName());
        }
        // EMPLOYEE: Filter by their own bookings
        else if (isEmployee && !isAdmin && !isDealer) {
            ownerUsername = auth.getName();
        }
        // ADMIN: See all (dealerId = null, ownerUsername = null)
        
        return PageResponse.of(testDriveRepository.search(search, statusStr, dealerId, ownerUsername, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public TestDriveResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public TestDriveResponse create(TestDriveRequest req) {
        // Employee can only book test drives for their own linked dealer
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isEmployee = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));
        boolean isAdmin    = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDealer   = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEALER"));

        if (isEmployee && !isAdmin && !isDealer) {
            userRepository.findByUsername(auth.getName()).ifPresent(u -> {
                if (u.getDealer() != null) {
                    // Force dealer to their own — employee cannot book for other dealers
                    req.setDealerId(u.getDealer().getId());
                } else {
                    throw new com.hyundai.dms.common.exception.BusinessException(
                            "Your account is not linked to any dealer. Contact your admin.");
                }
            });
        }
        TestDrive td = TestDrive.builder()
                .customerName(req.getCustomerName())
                .customerPhone(req.getCustomerPhone())
                .customerEmail(req.getCustomerEmail())
                .scheduledDate(req.getScheduledDate())
                .scheduledTime(req.getScheduledTime())
                .notes(req.getNotes())
                .status(req.getStatus() != null ? req.getStatus() : TestDrive.TestDriveStatus.SCHEDULED)
                .vehicle(vehicleRepository.findById(req.getVehicleId())
                        .orElseThrow(() -> new ResourceNotFoundException("Vehicle", req.getVehicleId())))
                .dealer(dealerRepository.findById(req.getDealerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dealer", req.getDealerId())))
                .build();
        return toResponse(testDriveRepository.save(td));
    }

    @Transactional
    public TestDriveResponse update(Long id, TestDriveRequest req) {
        TestDrive td = findById(id);
        td.setCustomerName(req.getCustomerName());
        td.setCustomerPhone(req.getCustomerPhone());
        td.setCustomerEmail(req.getCustomerEmail());
        td.setScheduledDate(req.getScheduledDate());
        td.setScheduledTime(req.getScheduledTime());
        td.setNotes(req.getNotes());
        if (req.getStatus() != null) td.setStatus(req.getStatus());
        if (req.getVehicleId() != null)
            td.setVehicle(vehicleRepository.findById(req.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", req.getVehicleId())));
        if (req.getDealerId() != null)
            td.setDealer(dealerRepository.findById(req.getDealerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dealer", req.getDealerId())));
        return toResponse(testDriveRepository.save(td));
    }

    @Transactional
    public void delete(Long id) {
        TestDrive td = findById(id);
        td.setStatus(TestDrive.TestDriveStatus.CANCELLED);
        testDriveRepository.save(td);
    }

    private TestDrive findById(Long id) {
        return testDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TestDrive", id));
    }

    private TestDriveResponse toResponse(TestDrive td) {
        TestDriveResponse r = new TestDriveResponse();
        r.setId(td.getId());
        r.setCustomerName(td.getCustomerName());
        r.setCustomerPhone(td.getCustomerPhone());
        r.setCustomerEmail(td.getCustomerEmail());
        r.setScheduledDate(td.getScheduledDate());
        r.setScheduledTime(td.getScheduledTime());
        r.setNotes(td.getNotes());
        r.setStatus(td.getStatus());
        if (td.getVehicle() != null) {
            r.setVehicleId(td.getVehicle().getId());
            r.setVehicleModel(td.getVehicle().getModel());
            r.setVehicleVin(td.getVehicle().getVin());
        }
        if (td.getDealer() != null) {
            r.setDealerId(td.getDealer().getId());
            r.setDealerName(td.getDealer().getDealerName());
        }
        r.setCreatedBy(td.getCreatedBy());
        r.setCreatedAt(td.getCreatedAt());
        r.setUpdatedBy(td.getUpdatedBy());
        r.setUpdatedAt(td.getUpdatedAt());
        return r;
    }
}
