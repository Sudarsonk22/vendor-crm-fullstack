import React, { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";

const titles = {
  in: "Stock In",
  out: "Stock Out",
  adjust: "Adjust Stock",
};

const StockDialog = ({ type, product, onSave, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const number = Number(quantity);

    if (quantity === "" || !Number.isInteger(number)) {
      setError("Enter a whole number");
      return;
    }
    if (type !== "adjust" && number < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (type === "adjust" && number < 0) {
      setError("Stock cannot be negative");
      return;
    }
    if (type === "out" && number > product.stock) {
      setError(`Not enough stock. Available: ${product.stock}`);
      return;
    }
    if (type === "adjust" && !reason.trim()) {
      setError("Reason is required for an adjustment");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onSave(number, reason.trim());
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  let newStock = null;
  if (quantity !== "" && Number.isInteger(Number(quantity))) {
    const number = Number(quantity);
    if (type === "in") newStock = product.stock + number;
    if (type === "out") newStock = product.stock - number;
    if (type === "adjust") newStock = number;
  }

  return (
    <div className="inv-overlay" onClick={onClose}>
      <form
        className="inv-dialog"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>{titles[type]}</h3>
        <p className="inv-dialog-sub">
          {product.name} ({product.sku})
        </p>

        <div className="inv-current">
          Current stock: <strong>{product.stock}</strong>
          {newStock !== null && newStock >= 0 && (
            <span>
              {" "}
              → New stock: <strong>{newStock}</strong>
            </span>
          )}
        </div>

        <label className="inv-label" htmlFor="inv-quantity">
          {type === "adjust" ? "New total count" : "Quantity"}
        </label>
        <input
          id="inv-quantity"
          className="inv-input"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          autoFocus
        />

        <label className="inv-label" htmlFor="inv-reason">
          Reason {type === "adjust" ? "*" : "(optional)"}
        </label>
        <input
          id="inv-reason"
          className="inv-input"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={
            type === "in"
              ? "e.g. New delivery"
              : type === "out"
              ? "e.g. Sold, damaged"
              : "e.g. Stock count correction"
          }
        />

        {error && <div className="inv-error">{error}</div>}

        <div className="inv-actions">
          <button type="button" className="inv-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="inv-save" disabled={saving}>
            {saving ? "Saving..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockDialog;