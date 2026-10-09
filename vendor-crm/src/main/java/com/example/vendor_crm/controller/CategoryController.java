package com.example.vendor_crm.controller;

import com.example.vendor_crm.dto.NameRequest;
import com.example.vendor_crm.exception.ConflictException;
import com.example.vendor_crm.model.Category;
import com.example.vendor_crm.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> list() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody NameRequest req) {
        String name = req.getName().trim();
        if (categoryRepository.existsByName(name)) {
            throw new ConflictException("Category already exists");
        }
        Category category = new Category();
        category.setName(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }
}