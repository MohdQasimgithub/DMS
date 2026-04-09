package com.hyundai.dms.domain.testdrive.dto;

import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class TestDriveResponse {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String notes;
    private TestDrive.TestDriveStatus status;
    private Long vehicleId;
    private String vehicleModel;
    private String vehicleVin;
    private Long dealerId;
    private String dealerName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
}
