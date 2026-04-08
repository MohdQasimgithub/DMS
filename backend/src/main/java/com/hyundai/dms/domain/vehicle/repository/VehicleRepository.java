package com.hyundai.dms.domain.vehicle.repository;

import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

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
}
