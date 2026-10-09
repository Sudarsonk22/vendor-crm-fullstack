import React, { useEffect, useState } from "react";

import {
  getCategories,
  getBrands,
  getVendors,
  createCategory,
  createBrand,
  createVendor,
  uploadImage,
} from "../services/productService";

import QuickAddDialog from "./QuickAddDialog";

import "./ProductModal.css";

const emptyForm = {
  name: "",
  sku: "",
  categoryId: "",
  brandId: "",
  vendorId: "",
  price: "",
  discount: "",
  stock: "",
  lowStockThreshold: "",
  status: "ACTIVE",
  image: null,
};

const quickAddText = {
  category: "Category",
  brand: "Brand",
  vendor: "Vendor",
};

const statusLabel = (status) => {
  if (!status) return "";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProductModal = ({
  product,
  onClose,
  isEditing = false,
  isAdding = false,
  onSave,
}) => {
  const [formData, setFormData] = useState(emptyForm);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [quickAdd, setQuickAdd] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);

      const [cats, brs, vens] = await Promise.all([
        getCategories(),
        getBrands(),
        getVendors(),
      ]);

      setCategories(cats || []);
      setBrands(brs || []);
      setVendors(vens || []);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
      alert("Failed to load category, brand or vendor data.");
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (!isAdding && !isEditing) return;

    loadOptions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdding, isEditing]);

  useEffect(() => {
    if (isAdding) {
      setFormData({ ...emptyForm });
      setImagePreview("");
    } else if (product) {
      setFormData({
        name: product.name ?? "",
        sku: product.sku ?? "",
        categoryId: product.categoryId ?? "",
        brandId: product.brandId ?? "",
        vendorId: product.vendorId ?? "",
        price: product.price ?? "",
        discount: product.discount ?? "",
        stock: product.stock ?? "",
        lowStockThreshold: product.lowStockThreshold ?? "",
        status: product.status ?? "ACTIVE",
        image: null,
      });

      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      } else {
        setImagePreview("");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isAdding]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!product && !isAdding) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview("");

    const fileInput = document.getElementById("product-image-input");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const saveQuickAdd = async (name, email, phone) => {
    try {
      if (!name || !name.trim()) {
        alert("Name is required.");
        return;
      }

      if (quickAdd === "category") {
        const created = await createCategory(name.trim());
        await loadOptions();
        setFormData((prev) => ({ ...prev, categoryId: created.id }));
      } else if (quickAdd === "brand") {
        const created = await createBrand(name.trim());
        await loadOptions();
        setFormData((prev) => ({ ...prev, brandId: created.id }));
      } else if (quickAdd === "vendor") {
        const created = await createVendor(name.trim(), email, phone);
        await loadOptions();
        setFormData((prev) => ({ ...prev, vendorId: created.id }));
      }

      setQuickAdd(null);
    } catch (error) {
      console.error("Quick add failed:", error);

      alert(error?.response?.data?.message || "Failed to create item.");
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!formData.sku.trim()) {
      alert("SKU is required");
      return;
    }

    if (!formData.categoryId) {
      alert("Select a category");
      return;
    }

    if (!formData.brandId) {
      alert("Select a brand");
      return;
    }

    if (!formData.vendorId) {
      alert("Select a vendor");
      return;
    }

    if (formData.price === "" || Number(formData.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      alert("Enter a valid stock");
      return;
    }

    if (
      Number(formData.discount || 0) < 0 ||
      Number(formData.discount || 0) > 100
    ) {
      alert("Discount must be between 0 and 100");
      return;
    }

    if (Number(formData.lowStockThreshold || 0) < 0) {
      alert("Low stock level cannot be negative");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = imagePreview;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        categoryId: Number(formData.categoryId),
        brandId: Number(formData.brandId),
        vendorId: Number(formData.vendorId),
        price: Number(formData.price),
        discount: Number(formData.discount || 0),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold || 10),
        imageUrl: imageUrl || null,
        status: formData.status,
      };

      if (isEditing && product?.id) {
        payload.id = product.id;
      }

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);

      alert(error?.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // VIEW PRODUCT

  if (!isEditing && !isAdding) {
    const stockClass =
      product.stockStatus === "OUT_OF_STOCK"
        ? "stock-danger"
        : product.stockStatus === "LOW_STOCK"
        ? "stock-warning"
        : "stock-success";

    const stockText =
      product.stockStatus === "OUT_OF_STOCK"
        ? "Out of Stock"
        : product.stockStatus === "LOW_STOCK"
        ? `Low Stock (${product.stock})`
        : product.stock;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <span className="modal-label">PRODUCT DETAILS</span>
              <h2>{product.name}</h2>
            </div>

            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-product-image">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = "none";

                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}

            <div
              className="image-placeholder"
              style={{ display: product.imageUrl ? "none" : "flex" }}
            >
              No Image
            </div>
          </div>

          <div className="product-detail-grid">
            <div className="detail-item">
              <span className="detail-label">SKU</span>
              <span className="detail-value">{product.sku}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">CATEGORY</span>
              <span className="detail-value">{product.category}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">BRAND</span>
              <span className="detail-value">{product.brand}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">PRICE</span>
              <span className="detail-value price-value">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">DISCOUNT</span>
              <span className="detail-value discount-value">
                {product.discount}%
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">AVAILABLE STOCK</span>
              <span className={`stock-badge ${stockClass}`}>{stockText}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">STATUS</span>
              <span
                className={`status-badge ${
                  product.status === "ACTIVE"
                    ? "status-active"
                    : "status-inactive"
                }`}
              >
                {statusLabel(product.status)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">VENDOR</span>
              <span className="detail-value">{product.vendor}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">CREATED DATE</span>
              <span className="detail-value">
                {formatDate(product.createdAt)}
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-secondary-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADD / EDIT PRODUCT

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <span className="modal-label">
                {isAdding ? "ADD PRODUCT" : "EDIT PRODUCT"}
              </span>

              <h2>{isAdding ? "Add New Product" : "Edit Product"}</h2>
            </div>

            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <form className="edit-product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>SKU *</label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>

              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                  disabled={loadingOptions}
                >
                  <option value="">
                    {loadingOptions ? "Loading..." : "Select category"}
                  </option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={() => setQuickAdd("category")}
                >
                  + New
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Brand *</label>

              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                  disabled={loadingOptions}
                >
                  <option value="">
                    {loadingOptions ? "Loading..." : "Select brand"}
                  </option>

                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={() => setQuickAdd("brand")}
                >
                  + New
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Vendor *</label>

              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                  disabled={loadingOptions}
                >
                  <option value="">
                    {loadingOptions ? "Loading..." : "Select vendor"}
                  </option>

                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={() => setQuickAdd("vendor")}
                >
                  + New
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Price *</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>

              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Available Stock *</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock"
                min="0"
                disabled={isEditing}
              />

              {isEditing && (
                <small>
                  Change stock from the Inventory page so it is recorded in
                  history.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Low Stock Level</label>

              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="10"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="form-group image-upload-group">
              <label>Product Image</label>

              <div className="image-upload-box">
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="image-preview"
                    />

                    <div className="image-file-name">
                      {formData.image
                        ? formData.image.name
                        : "Current Product Image"}
                    </div>

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label htmlFor="product-image-input" className="upload-label">
                    <div className="upload-icon">+</div>

                    <span>Upload Product Image</span>

                    <small>PNG, JPG or WEBP · Max 5MB</small>

                    <input
                      id="product-image-input"
                      type="file"
                      name="image"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>
          </form>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-secondary-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="modal-primary-btn"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isAdding
                ? "Add Product"
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {quickAdd && (
        <QuickAddDialog
          title={`Add ${quickAddText[quickAdd]}`}
          label={quickAddText[quickAdd]}
          withContact={quickAdd === "vendor"}
          onSave={saveQuickAdd}
          onClose={() => setQuickAdd(null)}
        />
      )}
    </>
  );
};

export default ProductModal;