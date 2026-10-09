package com.example.vendor_crm.controller;

import com.example.vendor_crm.dto.PageResponse;
import com.example.vendor_crm.dto.ProductResponse;
import com.example.vendor_crm.dto.StockMovementResponse;
import com.example.vendor_crm.dto.StockRequest;
import com.example.vendor_crm.service.ProductService;
import com.example.vendor_crm.service.StockService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final StockService stockService;
    private final ProductService productService;

    public InventoryController(StockService stockService, ProductService productService) {
        this.stockService = stockService;
        this.productService = productService;
    }

    @PostMapping("/products/{id}/stock-in")
    public StockMovementResponse stockIn(@PathVariable Long id, @Valid @RequestBody StockRequest req, Principal principal) {
        return stockService.stockIn(id, req, userName(principal));
    }

    @PostMapping("/products/{id}/stock-out")
    public StockMovementResponse stockOut(@PathVariable Long id, @Valid @RequestBody StockRequest req, Principal principal) {
        return stockService.stockOut(id, req, userName(principal));
    }

    @PostMapping("/products/{id}/adjust")
    public StockMovementResponse adjust(@PathVariable Long id, @Valid @RequestBody StockRequest req, Principal principal) {
        return stockService.adjust(id, req, userName(principal));
    }

    @GetMapping("/low-stock")
    public List<ProductResponse> lowStock() {
        return productService.lowStock();
    }

    @GetMapping("/history")
    public PageResponse<StockMovementResponse> history(
            @RequestParam(required = false) Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return stockService.history(productId, page, size);
    }

    // there is no login yet, so this falls back to "staff" until we add it
    private String userName(Principal principal) {
        return principal == null ? "staff" : principal.getName();
    }
}