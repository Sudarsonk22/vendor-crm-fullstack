package com.example.vendor_crm.repository;

import com.example.vendor_crm.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    boolean existsByName(String name);
}