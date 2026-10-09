package com.example.vendor_crm.dto;

import com.example.vendor_crm.model.MovementType;
import java.time.LocalDateTime;

public class StockMovementResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String sku;
    private MovementType type;
    private int quantity;
    private int stockBefore;
    private int stockAfter;
    private String reason;
    private String doneBy;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public MovementType getType() { return type; }
    public void setType(MovementType type) { this.type = type; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getStockBefore() { return stockBefore; }
    public void setStockBefore(int stockBefore) { this.stockBefore = stockBefore; }

    public int getStockAfter() { return stockAfter; }
    public void setStockAfter(int stockAfter) { this.stockAfter = stockAfter; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDoneBy() { return doneBy; }
    public void setDoneBy(String doneBy) { this.doneBy = doneBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}