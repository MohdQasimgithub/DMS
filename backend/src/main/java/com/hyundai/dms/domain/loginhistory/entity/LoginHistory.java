package com.hyundai.dms.domain.loginhistory.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history", indexes = {
        @Index(name = "idx_lh_username", columnList = "username"),
        @Index(name = "idx_lh_time", columnList = "login_time")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(length = 200)
    private String roles;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LoginStatus status = LoginStatus.SUCCESS;

    @Column(length = 200)
    private String failureReason;

    public enum LoginStatus { SUCCESS, FAILED, LOCKED }
}
