package com.hyundai.dms.domain.loginhistory.repository;

import com.hyundai.dms.domain.loginhistory.entity.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    @Query("""
        SELECT l FROM LoginHistory l
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(l.username) LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(l.roles)    LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(l.status AS string) = :statusStr)
        ORDER BY l.loginTime DESC
        """)
    Page<LoginHistory> search(@Param("search") String search,
                               @Param("statusStr") String statusStr,
                               Pageable pageable);
}
