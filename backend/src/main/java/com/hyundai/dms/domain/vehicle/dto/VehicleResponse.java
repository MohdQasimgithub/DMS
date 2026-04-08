package com.hyundai.dms.domain.vehicle.dto;

import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VehicleResponse {
    private Long id;
    private String vin;
    private String model;
    private String variant;
    private String color;
    private Integer modelYear;
    private BigDecimal price;
    private Vehicle.VehicleStatus status;
    private Long dealerId;
    private String dealerName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
}
