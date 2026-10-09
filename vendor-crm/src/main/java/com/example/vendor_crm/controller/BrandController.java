package com.example.vendor_crm.controller;

import com.example.vendor_crm.dto.NameRequest;
import com.example.vendor_crm.exception.ConflictException;
import com.example.vendor_crm.model.Brand;
import com.example.vendor_crm.repository.BrandRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<Brand> list() {
        return brandRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Brand> create(@Valid @RequestBody NameRequest req) {
        String name = req.getName().trim();
        if (brandRepository.existsByName(name)) {
            throw new ConflictException("Brand already exists");
        }
        Brand brand = new Brand();
        brand.setName(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(brandRepository.save(brand));
    }
}