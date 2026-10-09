import React from "react";

const EmptyState = ({ title, message, onReset }) => {
  return (
    <div className="state-container empty-state">
      <div className="state-icon">📦</div>

      <h3>{title || "No Products Found"}</h3>

      <p>
        {message ||
          "There are no products available in the catalogue."}
      </p>

      {onReset && (
        <button className="reset-state-btn" onClick={onReset}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;