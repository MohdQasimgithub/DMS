package com.hyundai.dms.domain.dealer.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dealers", indexes = {
        @Index(name = "idx_dealer_code", columnList = "dealer_code", unique = true),
        @Index(name = "idx_dealer_region", columnList = "region")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dealer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dealer_code", nullable = false, unique = true, length = 20)
    private String dealerCode;

    @Column(name = "dealer_name", nullable = false, length = 100)
    private String dealerName;

    @Column(length = 200)
    private String address;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String region;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DealerStatus status = DealerStatus.ACTIVE;

    public enum DealerStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
