package com.example.vendor_crm.controller;

import com.example.vendor_crm.dto.VendorRequest;
import com.example.vendor_crm.exception.ConflictException;
import com.example.vendor_crm.model.Vendor;
import com.example.vendor_crm.repository.VendorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorRepository vendorRepository;

    public VendorController(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @GetMapping
    public List<Vendor> list() {
        return vendorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Vendor> create(@Valid @RequestBody VendorRequest req) {
        String name = req.getName().trim();
        if (vendorRepository.existsByName(name)) {
            throw new ConflictException("Vendor already exists");
        }
        Vendor vendor = new Vendor();
        vendor.setName(name);
        vendor.setEmail(req.getEmail());
        vendor.setPhone(req.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorRepository.save(vendor));
    }
}