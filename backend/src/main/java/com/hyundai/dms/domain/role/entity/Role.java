package com.hyundai.dms.domain.role.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import com.hyundai.dms.domain.menu.entity.Menu;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles", indexes = {
        @Index(name = "idx_role_name", columnList = "role_name", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_name", nullable = false, unique = true, length = 50)
    private String roleName;

    @Column(length = 200)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_menus",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_id")
    )
    @Builder.Default
    private Set<Menu> menus = new HashSet<>();
}
