package com.hyundai.dms.domain.dealer.service;

import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import com.hyundai.dms.domain.auditlog.service.AuditLogService;
import com.hyundai.dms.common.exception.BusinessException;
import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.dto.DealerRequest;
import com.hyundai.dms.domain.dealer.dto.DealerResponse;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealerService {

    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    /**
     * ADMIN  → sees all dealers (dealerId = null)
     * DEALER → sees only their own dealership (dealerId = X)
     * 
     * READ_UNCOMMITTED would allow dirty reads (seeing uncommitted changes).
     * We use READ_COMMITTED here — only committed data is visible.
     * This prevents dirty reads but non-repeatable reads can still occur.
     */
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public PageResponse<DealerResponse> getAll(String search, Dealer.DealerStatus status, Pageable pageable) {
        String statusStr = status != null ? status.name() : null;
        boolean showAll  = statusStr != null && !statusStr.isEmpty();

        // Dealer sees only their own dealership record
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin  = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDealer = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEALER"));

        Long dealerId = null;
        if (isDealer && !isAdmin) {
            dealerId = userRepository.findDealerIdByUsername(auth.getName());
        }

        return PageResponse.of(dealerRepository.search(search, statusStr, showAll, dealerId, pageable).map(this::toResponse));
    }

    /**
     * REPEATABLE_READ ensures that if we read the same dealer twice in one transaction,
     * we get the same result — prevents non-repeatable reads.
     */
    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public DealerResponse getById(Long id) {
        return toResponse(findById(id));
    }

    /**
     * READ_COMMITTED for writes — prevents dirty reads.
     * Duplicate check + save is safe because we check existence before insert.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public DealerResponse create(DealerRequest request) {
        if (dealerRepository.existsByDealerCode(request.getDealerCode())) {
            throw new DuplicateResourceException("Dealer code already exists: " + request.getDealerCode());
        }
        Dealer dealer = Dealer.builder()
                .dealerCode(request.getDealerCode())
                .dealerName(request.getDealerName())
                .address(request.getAddress())
                .city(request.getCity())
                .region(request.getRegion())
                .phone(request.getPhone())
                .email(request.getEmail())
                .managerName(request.getManagerName())
                .status(request.getStatus() != null ? request.getStatus() : Dealer.DealerStatus.ACTIVE)
                .build();
        return toResponse(dealerRepository.save(dealer));
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public DealerResponse update(Long id, DealerRequest request) {
        Dealer dealer = findById(id);
        if (!dealer.getDealerCode().equals(request.getDealerCode()) &&
                dealerRepository.existsByDealerCode(request.getDealerCode())) {
            throw new DuplicateResourceException("Dealer code already exists: " + request.getDealerCode());
        }
        dealer.setDealerCode(request.getDealerCode());
        dealer.setDealerName(request.getDealerName());
        dealer.setAddress(request.getAddress());
        dealer.setCity(request.getCity());
        dealer.setRegion(request.getRegion());
        dealer.setPhone(request.getPhone());
        dealer.setEmail(request.getEmail());
        dealer.setManagerName(request.getManagerName());
        if (request.getStatus() != null) dealer.setStatus(request.getStatus());
        return toResponse(dealerRepository.save(dealer));
    }

    /**
     * SERIALIZABLE — highest isolation level.
     * Prevents phantom reads: no new dealers can be inserted by another transaction
     * while this delete transaction is running.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void delete(Long id) {
        Dealer dealer = findById(id);
        dealer.setStatus(Dealer.DealerStatus.INACTIVE);
        dealerRepository.save(dealer);
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<String> getRegions() {
        return dealerRepository.findDistinctRegions();
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<DealerResponse> getActiveByRegion(String region) {
        return dealerRepository.findActiveByRegion(region).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Dealer findById(Long id) {
        return dealerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer", id));
    }

    private DealerResponse toResponse(Dealer dealer) {
        DealerResponse res = new DealerResponse();
        res.setId(dealer.getId());
        res.setDealerCode(dealer.getDealerCode());
        res.setDealerName(dealer.getDealerName());
        res.setAddress(dealer.getAddress());
        res.setCity(dealer.getCity());
        res.setRegion(dealer.getRegion());
        res.setPhone(dealer.getPhone());
        res.setEmail(dealer.getEmail());
        res.setManagerName(dealer.getManagerName());
        res.setStatus(dealer.getStatus());
        res.setCreatedBy(dealer.getCreatedBy());
        res.setCreatedAt(dealer.getCreatedAt());
        res.setUpdatedBy(dealer.getUpdatedBy());
        res.setUpdatedAt(dealer.getUpdatedAt());
        return res;
    }
}
