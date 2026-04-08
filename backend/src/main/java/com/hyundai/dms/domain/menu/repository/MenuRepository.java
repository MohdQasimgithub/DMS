package com.hyundai.dms.domain.menu.repository;

import com.hyundai.dms.domain.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long>, QuerydslPredicateExecutor<Menu> {

    Optional<Menu> findByMenuCode(String menuCode);

    boolean existsByMenuCode(String menuCode);

    @Query("SELECT m FROM Menu m WHERE m.parent IS NULL AND m.active = true ORDER BY m.sortOrder")
    List<Menu> findRootMenus();

    @Query("SELECT m FROM Menu m WHERE m.parent.id = :parentId AND m.active = true ORDER BY m.sortOrder")
    List<Menu> findByParentId(Long parentId);
}
