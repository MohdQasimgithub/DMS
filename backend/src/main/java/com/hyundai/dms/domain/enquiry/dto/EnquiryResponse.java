package com.hyundai.dms.domain.enquiry.dto;

import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EnquiryResponse {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Enquiry.EnquiryType enquiryType;
    private String message;
    private String responseNotes;
    private Enquiry.EnquiryStatus status;
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
