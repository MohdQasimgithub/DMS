package com.hyundai.dms.domain.enquiry.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enquiries", indexes = {
        @Index(name = "idx_enq_status", columnList = "status"),
        @Index(name = "idx_enq_customer", columnList = "customer_name"),
        @Index(name = "idx_enq_vehicle", columnList = "vehicle_id"),
        @Index(name = "idx_enq_dealer", columnList = "dealer_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enquiry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Column(name = "enquiry_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EnquiryType enquiryType = EnquiryType.PURCHASE;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "response_notes", columnDefinition = "TEXT")
    private String responseNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnquiryStatus status = EnquiryStatus.NEW;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id", nullable = false)
    private Dealer dealer;

    public enum EnquiryType {
        PURCHASE, TEST_DRIVE, FINANCING, SERVICE, GENERAL
    }

    public enum EnquiryStatus {
        NEW, IN_PROGRESS, RESOLVED, CLOSED
    }
}
