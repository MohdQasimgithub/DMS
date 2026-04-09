package com.hyundai.dms.domain.testdrive.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "test_drives", indexes = {
        @Index(name = "idx_td_status", columnList = "status"),
        @Index(name = "idx_td_date", columnList = "scheduled_date"),
        @Index(name = "idx_td_customer", columnList = "customer_name"),
        @Index(name = "idx_td_vehicle", columnList = "vehicle_id"),
        @Index(name = "idx_td_dealer", columnList = "dealer_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestDrive extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(length = 500)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TestDriveStatus status = TestDriveStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id", nullable = false)
    private Dealer dealer;

    public enum TestDriveStatus {
        SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    }
}
