package com.hyundai.dms.domain.testdrive.dto;

import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TestDriveRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100)
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String customerPhone;

    @Email(message = "Invalid email")
    private String customerEmail;

    @NotNull(message = "Scheduled date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate scheduledDate;

    private LocalTime scheduledTime;

    @Size(max = 500)
    private String notes;

    private TestDrive.TestDriveStatus status;

    @NotNull(message = "Vehicle is required")
    private Long vehicleId;

    @NotNull(message = "Dealer is required")
    private Long dealerId;
}
