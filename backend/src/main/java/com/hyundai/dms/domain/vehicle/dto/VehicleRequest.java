package com.hyundai.dms.domain.vehicle.dto;

import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleRequest {

    @NotBlank(message = "VIN is required")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    private String vin;

    @NotBlank(message = "Model is required")
    @Size(max = 50)
    private String model;

    @Size(max = 50)
    private String variant;

    @Size(max = 20)
    private String color;

    @Min(value = 2000, message = "Model year must be 2000 or later")
    @Max(value = 2030)
    private Integer modelYear;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    private Vehicle.VehicleStatus status;

    private Long dealerId;
}
