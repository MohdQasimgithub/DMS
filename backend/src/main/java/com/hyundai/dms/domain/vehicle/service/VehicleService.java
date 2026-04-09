package com.hyundai.dms.domain.vehicle.service;

import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.vehicle.dto.VehicleRequest;
import com.hyundai.dms.domain.vehicle.dto.VehicleResponse;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DealerRepository dealerRepository;

    @Transactional(readOnly = true)
    public PageResponse<VehicleResponse> getAll(String search, Vehicle.VehicleStatus status, Pageable pageable) {
        String statusStr = status != null ? status.name() : null;
        // showAll=true only when admin explicitly filters by a specific status
        boolean showAll = statusStr != null && !statusStr.isEmpty();
        return PageResponse.of(vehicleRepository.search(search, statusStr, showAll, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public VehicleResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public VehicleResponse create(VehicleRequest request) {
        if (vehicleRepository.existsByVin(request.getVin())) {
            throw new DuplicateResourceException("VIN already exists: " + request.getVin());
        }
        Vehicle vehicle = buildVehicle(new Vehicle(), request);
        return toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = findById(id);
        if (!vehicle.getVin().equals(request.getVin()) && vehicleRepository.existsByVin(request.getVin())) {
            throw new DuplicateResourceException("VIN already exists: " + request.getVin());
        }
        buildVehicle(vehicle, request);
        return toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void delete(Long id) {
        Vehicle vehicle = findById(id);
        vehicle.setStatus(Vehicle.VehicleStatus.SOLD);
        vehicleRepository.save(vehicle);
    }

    @Transactional(readOnly = true)
    public List<String> getModels() {
        return vehicleRepository.findDistinctModels();
    }

    @Transactional(readOnly = true)
    public List<String> getVariantsByModel(String model) {
        return vehicleRepository.findVariantsByModel(model);
    }

    @Transactional(readOnly = true)
    public List<String> getColorsByModelAndVariant(String model, String variant) {
        return vehicleRepository.findColorsByModelAndVariant(model, variant);
    }

    private Vehicle buildVehicle(Vehicle vehicle, VehicleRequest request) {
        vehicle.setVin(request.getVin());
        vehicle.setModel(request.getModel());
        vehicle.setVariant(request.getVariant());
        vehicle.setColor(request.getColor());
        vehicle.setModelYear(request.getModelYear());
        vehicle.setPrice(request.getPrice());
        if (request.getStatus() != null) vehicle.setStatus(request.getStatus());
        if (request.getDealerId() != null) {
            Dealer dealer = dealerRepository.findById(request.getDealerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dealer", request.getDealerId()));
            vehicle.setDealer(dealer);
        }
        return vehicle;
    }

    private Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }

    private VehicleResponse toResponse(Vehicle v) {
        VehicleResponse res = new VehicleResponse();
        res.setId(v.getId());
        res.setVin(v.getVin());
        res.setModel(v.getModel());
        res.setVariant(v.getVariant());
        res.setColor(v.getColor());
        res.setModelYear(v.getModelYear());
        res.setPrice(v.getPrice());
        res.setStatus(v.getStatus());
        if (v.getDealer() != null) {
            res.setDealerId(v.getDealer().getId());
            res.setDealerName(v.getDealer().getDealerName());
        }
        res.setCreatedBy(v.getCreatedBy());
        res.setCreatedAt(v.getCreatedAt());
        res.setUpdatedBy(v.getUpdatedBy());
        res.setUpdatedAt(v.getUpdatedAt());
        return res;
    }
}
