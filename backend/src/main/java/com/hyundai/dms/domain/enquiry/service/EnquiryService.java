package com.hyundai.dms.domain.enquiry.service;

import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.enquiry.dto.EnquiryRequest;
import com.hyundai.dms.domain.enquiry.dto.EnquiryResponse;
import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import com.hyundai.dms.domain.enquiry.repository.EnquiryRepository;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final VehicleRepository vehicleRepository;
    private final DealerRepository dealerRepository;

    /**
     * ADMIN / DEALER → sees all enquiries (ownerUsername = null)
     * EMPLOYEE       → sees only their own submissions
     */
    @Transactional(readOnly = true)
    public PageResponse<EnquiryResponse> search(String search, Enquiry.EnquiryStatus status,
                                                 Enquiry.EnquiryType type, Pageable pageable) {
        String statusStr = status != null ? status.name() : null;
        String typeStr   = type   != null ? type.name()   : null;
        String ownerUsername = resolveOwnerFilter();
        return PageResponse.of(enquiryRepository.search(search, statusStr, typeStr, ownerUsername, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public EnquiryResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public EnquiryResponse create(EnquiryRequest req) {
        Enquiry e = Enquiry.builder()
                .customerName(req.getCustomerName())
                .customerPhone(req.getCustomerPhone())
                .customerEmail(req.getCustomerEmail())
                .enquiryType(req.getEnquiryType() != null ? req.getEnquiryType() : Enquiry.EnquiryType.GENERAL)
                .message(req.getMessage())
                .status(req.getStatus() != null ? req.getStatus() : Enquiry.EnquiryStatus.NEW)
                .dealer(dealerRepository.findById(req.getDealerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dealer", req.getDealerId())))
                .build();
        if (req.getVehicleId() != null)
            e.setVehicle(vehicleRepository.findById(req.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", req.getVehicleId())));
        return toResponse(enquiryRepository.save(e));
    }

    @Transactional
    public EnquiryResponse update(Long id, EnquiryRequest req) {
        Enquiry e = findById(id);
        e.setCustomerName(req.getCustomerName());
        e.setCustomerPhone(req.getCustomerPhone());
        e.setCustomerEmail(req.getCustomerEmail());
        if (req.getEnquiryType() != null) e.setEnquiryType(req.getEnquiryType());
        e.setMessage(req.getMessage());
        e.setResponseNotes(req.getResponseNotes());
        if (req.getStatus() != null) e.setStatus(req.getStatus());
        if (req.getVehicleId() != null)
            e.setVehicle(vehicleRepository.findById(req.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", req.getVehicleId())));
        return toResponse(enquiryRepository.save(e));
    }

    @Transactional
    public void delete(Long id) {
        Enquiry e = findById(id);
        e.setStatus(Enquiry.EnquiryStatus.CLOSED);
        enquiryRepository.save(e);
    }

    // ADMIN/DEALER → null (see all); EMPLOYEE → own username
    private String resolveOwnerFilter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        boolean isAdmin  = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDealer = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEALER"));
        if (isAdmin || isDealer) return null;
        return auth.getName(); // EMPLOYEE sees only own
    }

    private Enquiry findById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry", id));
    }

    private EnquiryResponse toResponse(Enquiry e) {
        EnquiryResponse r = new EnquiryResponse();
        r.setId(e.getId());
        r.setCustomerName(e.getCustomerName());
        r.setCustomerPhone(e.getCustomerPhone());
        r.setCustomerEmail(e.getCustomerEmail());
        r.setEnquiryType(e.getEnquiryType());
        r.setMessage(e.getMessage());
        r.setResponseNotes(e.getResponseNotes());
        r.setStatus(e.getStatus());
        if (e.getVehicle() != null) {
            r.setVehicleId(e.getVehicle().getId());
            r.setVehicleModel(e.getVehicle().getModel());
            r.setVehicleVin(e.getVehicle().getVin());
        }
        if (e.getDealer() != null) {
            r.setDealerId(e.getDealer().getId());
            r.setDealerName(e.getDealer().getDealerName());
        }
        r.setCreatedBy(e.getCreatedBy());
        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedBy(e.getUpdatedBy());
        r.setUpdatedAt(e.getUpdatedAt());
        return r;
    }
}
