import React, { useEffect, useState } from "react";

import {
  createCategory,
  createBrand,
  createVendor,
  uploadImage,
} from "../services/catalogueService";

import "./ProductModal.css";

const emptyList = [];

const findId = (list, id, name) => {
  if (id) return id;
  const match = list.find((item) => item.name === name);
  return match ? match.id : "";
};

const ProductModal = ({
  product = null,
  categories = emptyList,
  brands = emptyList,
  vendors = emptyList,
  onSave,
  onClose,
}) => {
  const isEditing = product !== null;

  const [form, setForm] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    categoryId: findId(categories, product?.categoryId, product?.category),
    brandId: findId(brands, product?.brandId, product?.brand),
    vendorId: findId(vendors, product?.vendorId, product?.vendor),
    price: product?.price ?? "",
    discount: product?.discount ?? "",
    stock: product?.stock ?? "",
    lowStockThreshold: product?.lowStockThreshold ?? "",
    status: product?.status || "ACTIVE",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");

  const [categoryList, setCategoryList] = useState(categories);
  const [brandList, setBrandList] = useState(brands);
  const [vendorList, setVendorList] = useState(vendors);

  const [createType, setCreateType] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  useEffect(() => {
    setBrandList(brands);
  }, [brands]);

  useEffect(() => {
    setVendorList(vendors);
  }, [vendors]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (createType) {
        closeCreateModal();
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line
  }, [createType, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleRemoveImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");

    const input = document.getElementById("product-image");
    if (input) input.value = "";
  };

  const openCreateModal = (type) => {
    setCreateType(type);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setCreateError("");
  };

  const closeCreateModal = () => {
    setCreateType(null);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setCreateError("");
    setCreating(false);
  };

  const handleCreateOption = async () => {
    const name = newName.trim();

    if (!name) {
      setCreateError(`Please enter ${createType} name.`);
      return;
    }

    if (createType === "vendor") {
      if (!/^\S+@\S+\.\S+$/.test(newEmail.trim())) {
        setCreateError("Please enter a valid email.");
        return;
      }
      if (!/^[0-9]{10}$/.test(newPhone)) {
        setCreateError("Phone number must be 10 digits.");
        return;
      }
    }

    try {
      setCreating(true);
      setCreateError("");

      if (createType === "category") {
        const item = await createCategory(name);
        setCategoryList((prev) => [...prev, item]);
        setForm((prev) => ({ ...prev, categoryId: item.id }));
      }

      if (createType === "brand") {
        const item = await createBrand(name);
        setBrandList((prev) => [...prev, item]);
        setForm((prev) => ({ ...prev, brandId: item.id }));
      }

      if (createType === "vendor") {
        const item = await createVendor(name, newEmail.trim(), newPhone);
        setVendorList((prev) => [...prev, item]);
        setForm((prev) => ({ ...prev, vendorId: item.id }));
      }

      closeCreateModal();
    } catch (err) {
      setCreateError(err.message || `Failed to create ${createType}.`);
      setCreating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.sku.trim()) return setError("SKU is required.");
    if (!form.categoryId) return setError("Please select a category.");
    if (!form.brandId) return setError("Please select a brand.");
    if (!form.vendorId) return setError("Please select a vendor.");

    if (form.price === "" || Number(form.price) <= 0) {
      return setError("Price must be greater than 0.");
    }

    if (!isEditing && (form.stock === "" || Number(form.stock) < 0)) {
      return setError("Please enter valid stock.");
    }

    if (form.discount !== "" && (Number(form.discount) < 0 || Number(form.discount) > 100)) {
      return setError("Discount must be between 0 and 100.");
    }

    try {
      setSaving(true);

      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        vendorId: Number(form.vendorId),
        price: Number(form.price),
        discount: Number(form.discount || 0),
        stock: Number(form.stock || 0),
        lowStockThreshold: Number(form.lowStockThreshold || 10),
        imageUrl: imageUrl,
        status: form.status,
      };

      if (isEditing) {
        await onSave({ id: product.id, ...payload });
      } else {
        await onSave(payload);
      }
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="product-modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <div className="product-modal-header">
            <div>
              <span className="product-modal-eyebrow">PRODUCT MANAGEMENT</span>
              <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
              <p>Add product information, stock and catalogue details.</p>
            </div>

            <button type="button" className="product-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="product-form-grid">
              <div className="product-field">
                <label>Product Name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="product-field">
                <label>SKU *</label>
                <input
                  name="sku"
                  type="text"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                />
              </div>

              <div className="product-field">
                <label>Category *</label>
                <div className="product-select-row">
                  <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categoryList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="product-new-btn"
                    onClick={() => openCreateModal("category")}
                  >
                    + New
                  </button>
                </div>
              </div>

              <div className="product-field">
                <label>Brand *</label>
                <div className="product-select-row">
                  <select name="brandId" value={form.brandId} onChange={handleChange}>
                    <option value="">Select Brand</option>
                    {brandList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="product-new-btn"
                    onClick={() => openCreateModal("brand")}
                  >
                    + New
                  </button>
                </div>
              </div>

              <div className="product-field">
                <label>Vendor *</label>
                <div className="product-select-row">
                  <select name="vendorId" value={form.vendorId} onChange={handleChange}>
                    <option value="">Select Vendor</option>
                    {vendorList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="product-new-btn"
                    onClick={() => openCreateModal("vendor")}
                  >
                    + New
                  </button>
                </div>
              </div>

              <div className="product-field">
                <label>Price *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="product-field">
                <label>Discount (%)</label>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="product-field">
                <label>Stock {isEditing ? "" : "*"}</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={isEditing}
                />
                {isEditing && (
                  <small className="product-hint">Change stock from the Inventory page.</small>
                )}
              </div>

              <div className="product-field">
                <label>Low Stock Level</label>
                <input
                  name="lowStockThreshold"
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={handleChange}
                  placeholder="10"
                />
              </div>

              <div className="product-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="product-field full">
                <label>Product Image</label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="product-file-input"
                  onChange={handleImageChange}
                />

                <label htmlFor="product-image" className="product-image-box">
                  {imagePreview ? (
                    <div className="product-preview-wrapper">
                      <img src={imagePreview} alt="Product" className="product-preview" />
                    </div>
                  ) : (
                    <div className="image-placeholder">
                      <div className="image-icon">+</div>
                      <strong>Add Product Image</strong>
                      <span>Click to select an image</span>
                    </div>
                  )}
                </label>

                {imagePreview && (
                  <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {error && <div className="product-form-error">{error}</div>}

            <div className="product-modal-footer">
              <button
                type="button"
                className="product-cancel-btn"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button type="submit" className="product-submit-btn" disabled={saving}>
                {saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {createType && (
        <div className="create-option-overlay" onClick={closeCreateModal}>
          <div className="create-option-modal" onClick={(e) => e.stopPropagation()}>
            <div className="create-option-header">
              <div>
                <span>CREATE NEW</span>
                <h3>
                  {createType === "category"
                    ? "New Category"
                    : createType === "brand"
                    ? "New Brand"
                    : "New Vendor"}
                </h3>
              </div>

              <button type="button" className="create-option-close" onClick={closeCreateModal}>
                ×
              </button>
            </div>

            <div className="create-option-body">
              <label>
                {createType.charAt(0).toUpperCase() + createType.slice(1)} Name
              </label>

              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setCreateError("");
                }}
                placeholder={`Enter ${createType} name`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!creating) handleCreateOption();
                  }
                }}
              />

              {createType === "vendor" && (
                <>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setCreateError("");
                    }}
                    placeholder="Enter vendor email"
                  />

                  <label>Phone *</label>
                  <input
                    type="text"
                    value={newPhone}
                    maxLength={10}
                    onChange={(e) => {
                      setNewPhone(e.target.value.replace(/\D/g, ""));
                      setCreateError("");
                    }}
                    placeholder="10 digit phone number"
                  />
                </>
              )}

              {createError && <div className="create-option-error">{createError}</div>}
            </div>

            <div className="create-option-actions">
              <button
                type="button"
                className="create-cancel-btn"
                onClick={closeCreateModal}
                disabled={creating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="create-submit-btn"
                onClick={handleCreateOption}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;