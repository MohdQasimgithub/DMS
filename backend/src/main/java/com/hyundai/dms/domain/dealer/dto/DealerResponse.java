package com.hyundai.dms.domain.dealer.dto;

import com.hyundai.dms.domain.dealer.entity.Dealer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DealerResponse {
    private Long id;
    private String dealerCode;
    private String dealerName;
    private String address;
    private String city;
    private String region;
    private String phone;
    private String email;
    private String managerName;
    private Dealer.DealerStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
}
