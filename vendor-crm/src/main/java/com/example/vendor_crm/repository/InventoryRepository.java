package com.example.vendor_crm.repository;

import com.example.vendor_crm.model.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductId(Long productId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from Inventory i where i.product.id = :productId")
    Optional<Inventory> findByProductIdForUpdate(@Param("productId") Long productId);

    @Query("select i from Inventory i where i.product.status = com.example.vendor_crm.model.ProductStatus.ACTIVE " +
            "and i.quantity <= i.lowStockThreshold order by i.quantity asc")
    List<Inventory> findLowStock();
}