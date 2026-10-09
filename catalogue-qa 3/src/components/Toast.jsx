import React, { useEffect } from "react";


const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "✕"}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;