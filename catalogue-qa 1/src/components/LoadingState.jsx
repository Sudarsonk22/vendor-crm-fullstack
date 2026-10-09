import React from "react";

const LoadingState = () => {
  return (
    <div className="state-container">
      <div className="loading-spinner"></div>

      <h3>Loading Catalogue...</h3>

      <p>
        Please wait while we fetch the products.
      </p>
    </div>
  );
};

export default LoadingState;