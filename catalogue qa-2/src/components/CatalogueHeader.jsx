import React from "react";

const CatalogueHeader = ({ onAddProduct }) => {
  return (
    <div className="catalogue-header">
      <div>
        <h1>Product Catalogue</h1>
        <p>Manage and review your product catalogue</p>
      </div>

      <button className="add-product-btn" onClick={onAddProduct}>
        + Add Product
      </button>
    </div>
  );
};

export default CatalogueHeader;