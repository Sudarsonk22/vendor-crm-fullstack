import React, { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";


const QuickAddDialog = ({ title, label, onSave, onClose, withContact = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

    if (!name.trim()) {
      setError(`${label} name is required`);
      return;
    }

    if (withContact) {
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        setError("Enter a valid email");
        return;
      }
      if (!phone.trim()) {
        setError("Phone number is required");
        return;
      }
      if (!/^[0-9]{10}$/.test(phone.trim())) {
        setError("Phone number must be 10 digits");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      await onSave(name.trim(), email.trim(), phone.trim());
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="quick-overlay" onClick={onClose}>
      <form
        className="quick-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>{title}</h3>
        <p className="quick-sub">This will be available in the dropdown right away.</p>

        <label className="quick-label" htmlFor="quick-name">
          {label} name {withContact && "*"}
        </label>
        <input
          id="quick-name"
          className="quick-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()} name`}
          autoFocus
        />

        {withContact && (
          <>
            <label
              className="quick-label"
              htmlFor="quick-email"
              style={{ marginTop: "14px" }}
            >
              Email *
            </label>
            <input
              id="quick-email"
              className="quick-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@company.com"
            />

            <label
              className="quick-label"
              htmlFor="quick-phone"
              style={{ marginTop: "14px" }}
            >
              Phone *
            </label>
            <input
              id="quick-phone"
              className="quick-input"
              type="text"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
            />
          </>
        )}

        {error && <div className="quick-error">{error}</div>}

        <div className="quick-actions">
          <button type="button" className="quick-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="quick-save" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickAddDialog;