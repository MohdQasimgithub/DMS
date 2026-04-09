package com.hyundai.dms.domain.auditlog.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_username",  columnList = "username"),
        @Index(name = "idx_audit_action",    columnList = "action"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(length = 100)
    private String fullName;

    @Column(length = 100)
    private String roles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditAction action;

    @Column(length = 200)
    private String description;

    @Column(length = 100)
    private String targetEntity;   // e.g. "User", "Dealer", "Vehicle"

    @Column(length = 100)
    private String targetId;       // e.g. username or entity ID

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum AuditAction {
        // Auth
        LOGIN, LOGOUT, LOGIN_FAILED, ACCOUNT_LOCKED,
        // User management
        USER_CREATED, USER_UPDATED, USER_DEACTIVATED, USER_UNLOCKED,
        USER_ROLE_CHANGED, ACCOUNT_EXPIRED,
        // Dealer
        DEALER_CREATED, DEALER_UPDATED, DEALER_DEACTIVATED,
        // Vehicle
        VEHICLE_CREATED, VEHICLE_UPDATED, VEHICLE_DELETED,
        // Role & Menu
        ROLE_CREATED, ROLE_UPDATED, ROLE_DEACTIVATED,
        MENU_CREATED, MENU_UPDATED, MENU_DEACTIVATED,
        // Test Drive & Enquiry
        TEST_DRIVE_BOOKED, TEST_DRIVE_UPDATED, TEST_DRIVE_CANCELLED,
        ENQUIRY_CREATED, ENQUIRY_UPDATED, ENQUIRY_CLOSED,
        // Config
        CONFIG_UPDATED
    }
}
