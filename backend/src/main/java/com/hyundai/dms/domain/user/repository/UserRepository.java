package com.hyundai.dms.domain.user.repository;

import com.hyundai.dms.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, QuerydslPredicateExecutor<User> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.username = :username")
    void incrementFailedAttempts(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.accountLocked = false WHERE u.username = :username")
    void resetFailedAttempts(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.accountLocked = true WHERE u.username = :username")
    void lockAccount(@Param("username") String username);
}
