import React, { useEffect } from "react";
import "./ProductDetails.css";

const statusText = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProductDetails = ({ product, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pd-header">
          <div>
            <span className="pd-eyebrow">PRODUCT DETAILS</span>
            <h2>{product.name}</h2>
          </div>

          <button type="button" className="pd-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="pd-body">
          <div className="pd-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <span>No image</span>
            )}
          </div>

          <div className="pd-grid">
            <div className="pd-card">
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>

            <div className="pd-card">
              <span>CATEGORY</span>
              <strong>{product.category}</strong>
            </div>

            <div className="pd-card">
              <span>BRAND</span>
              <strong>{product.brand}</strong>
            </div>

            <div className="pd-card">
              <span>PRICE</span>
              <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
            </div>

            <div className="pd-card">
              <span>DISCOUNT</span>
              <strong>{product.discount || 0}%</strong>
            </div>

            <div className="pd-card">
              <span>AVAILABLE STOCK</span>
              <strong>{product.stock}</strong>
              <em className={`pd-pill pd-${product.stockStatus}`}>
                {statusText[product.stockStatus] || product.stockStatus}
              </em>
            </div>

            <div className="pd-card">
              <span>LOW STOCK LEVEL</span>
              <strong>{product.lowStockThreshold}</strong>
            </div>

            <div className="pd-card">
              <span>VENDOR</span>
              <strong>{product.vendor}</strong>
            </div>

            <div className="pd-card">
              <span>STATUS</span>
              <strong>{product.status}</strong>
            </div>

            <div className="pd-card">
              <span>CREATED</span>
              <strong>{formatDate(product.createdAt)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;