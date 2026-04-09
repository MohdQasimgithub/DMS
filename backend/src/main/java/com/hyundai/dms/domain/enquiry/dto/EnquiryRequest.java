package com.hyundai.dms.domain.enquiry.dto;

import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EnquiryRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100)
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String customerPhone;

    @Email(message = "Invalid email")
    private String customerEmail;

    private Enquiry.EnquiryType enquiryType;

    @Size(max = 2000)
    private String message;

    @Size(max = 2000)
    private String responseNotes;

    private Enquiry.EnquiryStatus status;

    private Long vehicleId;

    @NotNull(message = "Dealer is required")
    private Long dealerId;
}
