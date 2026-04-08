package com.hyundai.dms.domain.dealer.repository;

import com.hyundai.dms.domain.dealer.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DealerRepository extends JpaRepository<Dealer, Long>, QuerydslPredicateExecutor<Dealer> {

    Optional<Dealer> findByDealerCode(String dealerCode);

    boolean existsByDealerCode(String dealerCode);

    @Query("SELECT DISTINCT d.region FROM Dealer d WHERE d.region IS NOT NULL ORDER BY d.region")
    List<String> findDistinctRegions();

    @Query("SELECT d FROM Dealer d WHERE d.region = :region AND d.status = 'ACTIVE'")
    List<Dealer> findActiveByRegion(@Param("region") String region);
}
