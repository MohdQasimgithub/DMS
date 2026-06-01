package com.hyundai.dms.domain.vehicle.repository;

import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, QuerydslPredicateExecutor<Vehicle> {

    Optional<Vehicle> findByVin(String vin);

    boolean existsByVin(String vin);

    @Query("SELECT DISTINCT v.model FROM Vehicle v ORDER BY v.model")
    List<String> findDistinctModels();

    @Query("SELECT DISTINCT v.variant FROM Vehicle v WHERE v.model = :model AND v.variant IS NOT NULL ORDER BY v.variant")
    List<String> findVariantsByModel(@Param("model") String model);

    @Query("SELECT DISTINCT v.color FROM Vehicle v WHERE v.model = :model AND v.variant = :variant ORDER BY v.color")
    List<String> findColorsByModelAndVariant(@Param("model") String model, @Param("variant") String variant);

    /**
     * ADMIN    → dealerId = null → sees all vehicles
     * DEALER   → dealerId = X    → sees only their dealership's vehicles
     * EMPLOYEE → dealerId = X    → sees only their dealership's vehicles
     */
    @Query("""
        SELECT v FROM Vehicle v LEFT JOIN v.dealer d
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(v.vin)     LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(v.model)   LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(v.variant) LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(v.color)   LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(d.dealerName) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(v.status AS string) = :statusStr)
          AND (:dealerId IS NULL OR d.id = :dealerId)
          AND (:showAll = true OR v.status <> 'SOLD')
        """)
    Page<Vehicle> search(@Param("search") String search,
                         @Param("statusStr") String statusStr,
                         @Param("dealerId") Long dealerId,
                         @Param("showAll") boolean showAll,
                         Pageable pageable);
}
