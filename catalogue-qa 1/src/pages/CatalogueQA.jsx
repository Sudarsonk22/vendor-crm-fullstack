import React, { useEffect, useState } from "react";

import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
} from "../services/productService";
import { getErrorMessage } from "../services/api";

const priceRanges = {
  "Below 2000": { minPrice: "", maxPrice: 1999.99 },
  "2000 - 5000": { minPrice: 2000, maxPrice: 5000 },
  "Above 5000": { minPrice: 5000.01, maxPrice: "" },
};

const sortOptions = {
  "price-low": { sortBy: "price", direction: "asc" },
  "price-high": { sortBy: "price", direction: "desc" },
  name: { sortBy: "name", direction: "asc" },
  default: { sortBy: "createdAt", direction: "desc" },
};

const pageSize = 6;

const CatalogueQA = () => {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // the backend counts pages from 0, the screen shows 1
  const [page, setPage] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  // wait a moment after typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadDropdowns = async () => {
    try {
      const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
      setCategories(cats);
      setBrands(brs);
    } catch (error) {
      console.error("Failed to load filters:", error);
    }
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setApiError("");

      const price = priceRanges[priceFilter] || {};
      const sort = sortOptions[sortBy];

      const data = await getProducts({
        search,
        categoryId: categoryFilter === "All" ? "" : categoryFilter,
        brandId: brandFilter === "All" ? "" : brandFilter,
        minPrice: price.minPrice,
        maxPrice: price.maxPrice,
        stock: stockFilter === "All" ? "" : stockFilter,
        status: statusFilter === "All" ? "" : statusFilter,
        sortBy: sort.sortBy,
        direction: sort.direction,
        page,
        size: pageSize,
      });

      setProducts(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, [
    search,
    categoryFilter,
    brandFilter,
    priceFilter,
    stockFilter,
    statusFilter,
    sortBy,
    page,
  ]);

  // a filter change always goes back to the first page
  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(0);
  };

  const handleSaveProduct = async (product) => {
    try {
      const { id, ...body } = product;
      await updateProduct(id, body);
      setEditingProduct(null);
      showToast("Product updated successfully");
      loadProducts();
      loadDropdowns();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleAddProduct = async (product) => {
    try {
      await createProduct(product);
      setAddingProduct(false);
      showToast("Product added successfully");
      loadProducts();
      loadDropdowns();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleDeleteProduct = async (product) => {
    const ok = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!ok) return;

    try {
      await deleteProduct(product.id);
      showToast("Product deleted successfully");
      loadProducts();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearch("");
    setCategoryFilter("All");
    setBrandFilter("All");
    setPriceFilter("All");
    setStockFilter("All");
    setStatusFilter("All");
    setSortBy("default");
    setPage(0);
  };

  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  };

  const hasFilters =
    searchTerm !== "" ||
    categoryFilter !== "All" ||
    brandFilter !== "All" ||
    priceFilter !== "All" ||
    stockFilter !== "All" ||
    statusFilter !== "All" ||
    sortBy !== "default";

  return (
    <div className="catalogue-page">
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="catalogue-header">
        <div>
          <span className="page-eyebrow">VENDOR CRM</span>
          <h1>Catalogue QA</h1>
          <p>Manage and review your vendor product catalogue.</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => setAddingProduct(true)}
          disabled={loading}
        >
          + Add Product
        </button>
      </div>

      <div className="catalogue-filter-card">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search product or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={categoryFilter} onChange={changeFilter(setCategoryFilter)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select value={brandFilter} onChange={changeFilter(setBrandFilter)}>
          <option value="All">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select value={priceFilter} onChange={changeFilter(setPriceFilter)}>
          <option value="All">All Prices</option>
          <option value="Below 2000">Below ₹2,000</option>
          <option value="2000 - 5000">₹2,000 - ₹5,000</option>
          <option value="Above 5000">Above ₹5,000</option>
        </select>

        <select value={stockFilter} onChange={changeFilter(setStockFilter)}>
          <option value="All">All Stock</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        <select value={statusFilter} onChange={changeFilter(setStatusFilter)}>
          <option value="All">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
        </select>

        <select value={sortBy} onChange={changeFilter(setSortBy)}>
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>

        {hasFilters && (
          <button className="reset-filter-btn" onClick={handleResetFilters}>
            Reset
          </button>
        )}
      </div>

      {!loading && !apiError && (
        <div className="catalogue-summary">
          <div>
            Showing <strong>{totalItems}</strong> product
            {totalItems !== 1 ? "s" : ""}
          </div>

          <div>
            Page <strong>{totalPages === 0 ? 0 : page + 1}</strong> of{" "}
            <strong>{totalPages}</strong>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : apiError ? (
        <ErrorState message={apiError} onRetry={loadProducts} />
      ) : products.length > 0 ? (
        <ProductTable
          products={products}
          onView={setSelectedProduct}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <EmptyState
          title="No Products Found"
          message="No products match your current search or filter selection."
          onReset={handleResetFilters}
        />
      )}

      {!loading && !apiError && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => goToPage(page - 1)}
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                className={`pagination-number ${page === p ? "active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            disabled={page === totalPages - 1}
            onClick={() => goToPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {editingProduct && (
        <ProductModal
          product={editingProduct}
          isEditing={true}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}

      {addingProduct && (
        <ProductModal
          isAdding={true}
          onClose={() => setAddingProduct(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
};

export default CatalogueQA;