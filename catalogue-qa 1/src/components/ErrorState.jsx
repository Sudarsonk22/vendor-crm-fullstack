import React from "react";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="state-container error-state">
      <div className="state-icon">⚠️</div>

      <h3>Something went wrong</h3>

      <p>
        {message || "Unable to load the product catalogue."}
      </p>

      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;