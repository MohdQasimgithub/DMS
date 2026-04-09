package com.hyundai.dms.domain.vehicle.service;

import com.hyundai.dms.domain.vehicle.entity.QVehicle;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Demonstrates QueryDSL dynamic predicate building.
 * Used for advanced filtering on vehicles.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleQueryService {

    private final VehicleRepository vehicleRepository;

    /**
     * QueryDSL-based dynamic search.
     * BooleanBuilder allows composing predicates at runtime — no JPQL string concatenation.
     */
    @Transactional(readOnly = true)
    public Page<Vehicle> findByDynamicFilter(String model, String status,
                                              Integer yearFrom, Integer yearTo,
                                              Pageable pageable) {
        QVehicle vehicle = QVehicle.vehicle;
        BooleanBuilder predicate = new BooleanBuilder();

        if (StringUtils.hasText(model)) {
            predicate.and(vehicle.model.containsIgnoreCase(model));
        }
        if (StringUtils.hasText(status)) {
            predicate.and(vehicle.status.stringValue().eq(status));
        }
        if (yearFrom != null) {
            predicate.and(vehicle.modelYear.goe(yearFrom));
        }
        if (yearTo != null) {
            predicate.and(vehicle.modelYear.loe(yearTo));
        }

        log.debug("QueryDSL predicate: {}", predicate);
        return vehicleRepository.findAll(predicate, pageable);
    }
}
