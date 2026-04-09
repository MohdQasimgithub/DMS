package com.hyundai.dms.domain.auditlog.repository;

import com.hyundai.dms.domain.auditlog.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(a.username)    LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(a.fullName)    LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(a.description) LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(a.targetEntity) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:actionStr IS NULL OR :actionStr = '' OR CAST(a.action AS string) = :actionStr)
        ORDER BY a.timestamp DESC
        """)
    Page<AuditLog> search(@Param("search") String search,
                           @Param("actionStr") String actionStr,
                           Pageable pageable);
}
