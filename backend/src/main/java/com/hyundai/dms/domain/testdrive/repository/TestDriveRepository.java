package com.hyundai.dms.domain.testdrive.repository;

import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {

    /**
     * ownerUsername = null  → ADMIN/DEALER sees all
     * ownerUsername = "xyz" → EMPLOYEE sees only their own bookings
     */
    @Query("""
        SELECT t FROM TestDrive t
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(t.customerName)      LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.customerPhone)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.vehicle.model)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.dealer.dealerName) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(t.status AS string) = :statusStr)
          AND (:ownerUsername IS NULL OR t.createdBy = :ownerUsername)
        """)
    Page<TestDrive> search(@Param("search") String search,
                           @Param("statusStr") String statusStr,
                           @Param("ownerUsername") String ownerUsername,
                           Pageable pageable);
}
