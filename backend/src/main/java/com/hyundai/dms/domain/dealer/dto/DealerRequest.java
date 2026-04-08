package com.hyundai.dms.domain.dealer.dto;

import com.hyundai.dms.domain.dealer.entity.Dealer;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DealerRequest {

    @NotBlank(message = "Dealer code is required")
    @Size(max = 20)
    private String dealerCode;

    @NotBlank(message = "Dealer name is required")
    @Size(max = 100)
    private String dealerName;

    @Size(max = 200)
    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    private String region;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    @Email(message = "Invalid email")
    private String email;

    @Size(max = 100)
    private String managerName;

    private Dealer.DealerStatus status;
}
