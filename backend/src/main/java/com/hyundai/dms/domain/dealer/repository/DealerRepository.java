package com.hyundai.dms.domain.dealer.repository;

import com.hyundai.dms.domain.dealer.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface DealerRepository extends JpaRepository<Dealer, Long>, QuerydslPredicateExecutor<Dealer> {

    Optional<Dealer> findByDealerCode(String dealerCode);
    boolean existsByDealerCode(String dealerCode);

    @Query("SELECT DISTINCT d.region FROM Dealer d WHERE d.region IS NOT NULL ORDER BY d.region")
    List<String> findDistinctRegions();

    @Query("SELECT d FROM Dealer d WHERE d.region = :region AND d.status = 'ACTIVE'")
    List<Dealer> findActiveByRegion(@Param("region") String region);

    @Query("""
        SELECT d FROM Dealer d
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(d.dealerName)  LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(d.dealerCode)  LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(d.city)        LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(d.region)      LIKE LOWER(CONCAT('%',:search,'%')) OR
               LOWER(d.managerName) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:statusStr IS NULL OR :statusStr = '' OR CAST(d.status AS string) = :statusStr)
          AND (:showAll = true OR d.status <> 'INACTIVE')
          AND (:dealerId IS NULL OR d.id = :dealerId)
        """)
    Page<Dealer> search(@Param("search") String search,
                        @Param("statusStr") String statusStr,
                        @Param("showAll") boolean showAll,
                        @Param("dealerId") Long dealerId,
                        Pageable pageable);
}
