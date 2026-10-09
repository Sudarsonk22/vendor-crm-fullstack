package com.example.vendor_crm.service;

import com.example.vendor_crm.dto.PageResponse;
import com.example.vendor_crm.dto.ProductRequest;
import com.example.vendor_crm.dto.ProductResponse;
import com.example.vendor_crm.exception.BadRequestException;
import com.example.vendor_crm.exception.ConflictException;
import com.example.vendor_crm.exception.NotFoundException;
import com.example.vendor_crm.model.*;
import com.example.vendor_crm.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final VendorRepository vendorRepository;
    private final InventoryRepository inventoryRepository;

    private static final Map<String, String> SORT_FIELDS = Map.of(
            "name", "name",
            "price", "price",
            "stock", "inventory.quantity",
            "createdAt", "createdAt"
    );

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          VendorRepository vendorRepository,
                          InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.vendorRepository = vendorRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public PageResponse<ProductResponse> list(String search, Long categoryId, Long brandId,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              String stock, ProductStatus status,
                                              String sortBy, String direction,
                                              int page, int size) {

        if (page < 0) {
            throw new BadRequestException("Page cannot be negative");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("Page size must be between 1 and 100");
        }
        if (minPrice != null && minPrice.signum() < 0) {
            throw new BadRequestException("Minimum price cannot be negative");
        }
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new BadRequestException("Minimum price cannot be greater than maximum price");
        }
        if (stock != null && !stock.isBlank()
                && !stock.equals("IN_STOCK") && !stock.equals("LOW_STOCK") && !stock.equals("OUT_OF_STOCK")) {
            throw new BadRequestException("Stock filter must be IN_STOCK, LOW_STOCK or OUT_OF_STOCK");
        }

        String sortField = SORT_FIELDS.get(sortBy == null || sortBy.isBlank() ? "createdAt" : sortBy);
        if (sortField == null) {
            throw new BadRequestException("Cannot sort by '" + sortBy + "'");
        }

        Sort.Direction dir = Sort.Direction.DESC;
        if (direction != null && !direction.isBlank()) {
            if (direction.equalsIgnoreCase("asc")) {
                dir = Sort.Direction.ASC;
            } else if (!direction.equalsIgnoreCase("desc")) {
                throw new BadRequestException("Direction must be asc or desc");
            }
        }

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> filters = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                filters.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("sku")), like)
                ));
            }
            if (categoryId != null) {
                filters.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                filters.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (minPrice != null) {
                filters.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                filters.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (stock != null && !stock.isBlank()) {
                Join<Product, Inventory> inv = root.join("inventory");
                if ("IN_STOCK".equals(stock)) {
                    filters.add(cb.greaterThan(inv.<Integer>get("quantity"), inv.<Integer>get("lowStockThreshold")));
                }
                if ("LOW_STOCK".equals(stock)) {
                    filters.add(cb.greaterThan(inv.<Integer>get("quantity"), 0));
                    filters.add(cb.lessThanOrEqualTo(inv.<Integer>get("quantity"), inv.<Integer>get("lowStockThreshold")));
                }
                if ("OUT_OF_STOCK".equals(stock)) {
                    filters.add(cb.lessThanOrEqualTo(inv.<Integer>get("quantity"), 0));
                }
            }
            if (status != null) {
                filters.add(cb.equal(root.get("status"), status));
            }

            return cb.and(filters.toArray(new Predicate[0]));
        };

        Page<Product> result = productRepository.findAll(spec, PageRequest.of(page, size, Sort.by(dir, sortField)));

        List<ProductResponse> items = result.getContent().stream().map(this::toResponse).toList();
        return new PageResponse<>(items, page, size, result.getTotalElements(), result.getTotalPages());
    }

    public ProductResponse getById(Long id) {
        return toResponse(findProduct(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        if (productRepository.existsBySku(req.getSku().trim())) {
            throw new ConflictException("A product with this SKU already exists");
        }

        Product product = new Product();
        fillProduct(product, req);
        Product saved = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(saved);
        inventory.setQuantity(req.getStock() == null ? 0 : req.getStock());
        inventory.setLowStockThreshold(req.getLowStockThreshold() == null ? 10 : req.getLowStockThreshold());
        inventoryRepository.save(inventory);
        saved.setInventory(inventory);

        return toResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product product = findProduct(id);

        if (productRepository.existsBySkuAndIdNot(req.getSku().trim(), id)) {
            throw new ConflictException("A product with this SKU already exists");
        }

        fillProduct(product, req);

        if (product.getInventory() != null && req.getLowStockThreshold() != null) {
            product.getInventory().setLowStockThreshold(req.getLowStockThreshold());
            inventoryRepository.save(product.getInventory());
        }

        return toResponse(productRepository.save(product));
    }

    // soft delete, the row stays so stock history is not lost later
    public void delete(Long id) {
        Product product = findProduct(id);
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    public List<ProductResponse> lowStock() {
        return inventoryRepository.findLowStock().stream()
                .map(i -> toResponse(i.getProduct()))
                .toList();
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with id " + id));
    }

    private void fillProduct(Product product, ProductRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Category does not exist"));
        Brand brand = brandRepository.findById(req.getBrandId())
                .orElseThrow(() -> new BadRequestException("Brand does not exist"));
        Vendor vendor = vendorRepository.findById(req.getVendorId())
                .orElseThrow(() -> new BadRequestException("Vendor does not exist"));

        product.setName(req.getName().trim());
        product.setSku(req.getSku().trim());
        product.setCategory(category);
        product.setBrand(brand);
        product.setVendor(vendor);
        product.setPrice(req.getPrice());
        product.setDiscount(req.getDiscount() == null ? BigDecimal.ZERO : req.getDiscount());
        product.setImageUrl(req.getImageUrl());
        product.setStatus(req.getStatus() == null ? ProductStatus.ACTIVE : req.getStatus());
    }

    private ProductResponse toResponse(Product p) {
        Inventory inv = p.getInventory();

        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setSku(p.getSku());
        r.setCategoryId(p.getCategory().getId());
        r.setCategory(p.getCategory().getName());
        r.setBrandId(p.getBrand().getId());
        r.setBrand(p.getBrand().getName());
        r.setVendorId(p.getVendor().getId());
        r.setVendor(p.getVendor().getName());
        r.setPrice(p.getPrice());
        r.setDiscount(p.getDiscount());
        r.setStock(inv == null ? 0 : inv.getQuantity());
        r.setLowStockThreshold(inv == null ? 10 : inv.getLowStockThreshold());
        r.setStockStatus(inv == null ? StockStatus.OUT_OF_STOCK : inv.getStockStatus());
        r.setImageUrl(p.getImageUrl());
        r.setStatus(p.getStatus());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}