package com.hyundai.dms.domain.testdrive.repository;

import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {

    /**
     * ADMIN    → dealerId = null, ownerUsername = null → sees all
     * DEALER   → dealerId = X, ownerUsername = null    → sees only their dealership's test drives
     * EMPLOYEE → dealerId = null, ownerUsername = "xyz" → sees only their own bookings
     */
    @Query("""
        SELECT t FROM TestDrive t
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(t.customerName)      LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.customerPhone)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.vehicle.model)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(t.dealer.dealerName) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(t.status AS string) = :statusStr)
          AND (:dealerId IS NULL OR t.dealer.id = :dealerId)
          AND (:ownerUsername IS NULL OR t.createdBy = :ownerUsername)
        """)
    Page<TestDrive> search(@Param("search") String search,
                           @Param("statusStr") String statusStr,
                           @Param("dealerId") Long dealerId,
                           @Param("ownerUsername") String ownerUsername,
                           Pageable pageable);
}
