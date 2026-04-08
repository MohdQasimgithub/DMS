package com.hyundai.dms.domain.vehicle.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vehicles", indexes = {
        @Index(name = "idx_vehicle_vin", columnList = "vin", unique = true),
        @Index(name = "idx_vehicle_model", columnList = "model"),
        @Index(name = "idx_vehicle_dealer", columnList = "dealer_id"),
        @Index(name = "idx_vehicle_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 17)
    private String vin;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(length = 50)
    private String variant;

    @Column(length = 20)
    private String color;

    @Column(name = "model_year")
    private Integer modelYear;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    public enum VehicleStatus {
        AVAILABLE, RESERVED, SOLD, IN_TRANSIT
    }
}
