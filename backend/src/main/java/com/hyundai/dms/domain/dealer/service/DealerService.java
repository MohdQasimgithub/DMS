package com.hyundai.dms.domain.dealer.service;

import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.dto.DealerRequest;
import com.hyundai.dms.domain.dealer.dto.DealerResponse;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealerService {

    private final DealerRepository dealerRepository;

    @Transactional(readOnly = true)
    public PageResponse<DealerResponse> getAll(Pageable pageable) {
        Page<DealerResponse> page = dealerRepository.findAll(pageable).map(this::toResponse);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public DealerResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
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

    @Transactional
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

    @Transactional
    public void delete(Long id) {
        Dealer dealer = findById(id);
        dealer.setStatus(Dealer.DealerStatus.INACTIVE);
        dealerRepository.save(dealer);
    }

    @Transactional(readOnly = true)
    public List<String> getRegions() {
        return dealerRepository.findDistinctRegions();
    }

    @Transactional(readOnly = true)
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
