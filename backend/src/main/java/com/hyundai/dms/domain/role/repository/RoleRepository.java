package com.hyundai.dms.domain.role.repository;

import com.hyundai.dms.domain.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long>, QuerydslPredicateExecutor<Role> {
    Optional<Role> findByRoleName(String roleName);
    boolean existsByRoleName(String roleName);
}
