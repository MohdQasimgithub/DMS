package com.hyundai.dms.domain.enquiry.repository;

import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    /**
     * ownerUsername = null  → ADMIN/DEALER sees all
     * ownerUsername = "xyz" → EMPLOYEE sees only their own submissions
     */
    @Query("""
        SELECT e FROM Enquiry e
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(e.customerName)      LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(e.customerPhone)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(e.vehicle.model)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(e.dealer.dealerName) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(e.status AS string) = :statusStr)
          AND (:typeStr   IS NULL OR :typeStr   = '' OR CAST(e.enquiryType AS string) = :typeStr)
          AND (:ownerUsername IS NULL OR e.createdBy = :ownerUsername)
        """)
    Page<Enquiry> search(@Param("search") String search,
                         @Param("statusStr") String statusStr,
                         @Param("typeStr") String typeStr,
                         @Param("ownerUsername") String ownerUsername,
                         Pageable pageable);
}
