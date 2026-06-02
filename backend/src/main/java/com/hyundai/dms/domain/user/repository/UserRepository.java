package com.hyundai.dms.domain.user.repository;

import com.hyundai.dms.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, QuerydslPredicateExecutor<User> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    /**
     * ADMIN  → dealerId = null → sees all users EXCEPT other admins
     * DEALER → dealerId = X   → sees only EMPLOYEE users linked to their dealer
     *
     * Uses LEFT JOIN so users with NULL dealer_id are included when dealerId param is null.
     * When dealerId is provided, only EMPLOYEE role users with that dealer_id are returned.
     * ADMIN role users are NEVER shown to dealers (security protection).
     */
    @Query("""
        SELECT DISTINCT u FROM User u LEFT JOIN u.dealer d LEFT JOIN u.roles r
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(u.username) LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(u.email)    LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:dealerId IS NULL OR (d.id = :dealerId AND r.roleName = 'EMPLOYEE'))
          AND NOT EXISTS (SELECT 1 FROM User u2 JOIN u2.roles r2 WHERE u2.id = u.id AND r2.roleName = 'ADMIN')
        """)
    Page<User> search(@Param("search") String search,
                      @Param("dealerId") Long dealerId,
                      Pageable pageable);

    /**
     * Native query to get dealer_id directly from DB — no lazy loading, no JPQL join issues.
     */
    @Query(value = "SELECT dealer_id FROM users WHERE username = :username", nativeQuery = true)
    Long findDealerIdByUsername(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.username = :username")
    void incrementFailedAttempts(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.accountLocked = false, u.lockTime = null WHERE u.username = :username")
    void resetFailedAttempts(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.accountLocked = true, u.lockTime = :lockTime WHERE u.username = :username")
    void lockAccount(@Param("username") String username, @Param("lockTime") LocalDateTime lockTime);

    @Modifying
    @Query("UPDATE User u SET u.accountLocked = false, u.lockTime = null, u.failedLoginAttempts = 0 WHERE u.username = :username")
    void unlockAccount(@Param("username") String username);
}
