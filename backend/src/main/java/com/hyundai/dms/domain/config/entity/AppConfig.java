package com.hyundai.dms.domain.config.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Key-value configuration store for application settings.
 */
@Entity
@Table(name = "app_configs", indexes = {
        @Index(name = "idx_config_key", columnList = "config_key", unique = true),
        @Index(name = "idx_config_group", columnList = "config_group")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppConfig extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;

    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "config_group", length = 50)
    private String configGroup;

    @Column(length = 200)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean editable = true;
}
