package com.hyundai.dms.domain.menu.entity;

import com.hyundai.dms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menus", indexes = {
        @Index(name = "idx_menu_code", columnList = "menu_code", unique = true),
        @Index(name = "idx_menu_parent", columnList = "parent_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_code", nullable = false, unique = true, length = 50)
    private String menuCode;

    @Column(name = "menu_name", nullable = false, length = 100)
    private String menuName;

    @Column(length = 200)
    private String url;

    @Column(length = 50)
    private String icon;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Menu parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<Menu> children = new ArrayList<>();
}
