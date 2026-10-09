import React from "react";

const ProductActions = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="product-actions">
      <button
        className="action-btn view-btn"
        onClick={() => onView(product)}
        title="View Product"
      >
        View
      </button>

      <button
        className="action-btn edit-btn"
        onClick={() => onEdit(product)}
        title="Edit Product"
      >
        Edit
      </button>

      <button
        className="action-btn delete-btn"
        onClick={() => onDelete(product)}
        title="Delete Product"
      >
        Delete
      </button>
    </div>
  );
};

export default ProductActions;