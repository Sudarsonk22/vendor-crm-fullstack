package com.example.vendor_crm.repository;

import com.example.vendor_crm.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    boolean existsByName(String name);
}