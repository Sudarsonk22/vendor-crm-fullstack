import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import {
  stockIn,
  stockOut,
  adjustStock,
  getLowStock,
} from "../services/inventoryService";
import { getErrorMessage } from "../services/api";

import Toast from "../components/Toast";
import StockDialog from "../components/StockDialog";
import InventoryHistory from "../components/InventoryHistory";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import "./Inventory.css";

const pageSize = 8;

const statusText = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const statusClass = {
  IN_STOCK: "inv-in",
  LOW_STOCK: "inv-low",
  OUT_OF_STOCK: "inv-out",
};

const Inventory = () => {
  const [tab, setTab] = useState("stock");

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [page, setPage] = useState(0);

  const [lowStock, setLowStock] = useState([]);

  const [dialog, setDialog] = useState(null);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        search,
        stock: stockFilter === "All" ? "" : stockFilter,
        sortBy: "stock",
        direction: "asc",
        page,
        size: pageSize,
      });

      setProducts(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (err) {
      setProducts([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    try {
      const data = await getLowStock();
      setLowStock(data);
    } catch (err) {
      console.error("Failed to load low stock:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, [search, stockFilter, page]);

  useEffect(() => {
    loadLowStock();
  }, []);

  const handleSave = async (quantity, reason) => {
    const { type, product } = dialog;

    if (type === "in") {
      await stockIn(product.id, quantity, reason);
    } else if (type === "out") {
      await stockOut(product.id, quantity, reason);
    } else {
      await adjustStock(product.id, quantity, reason);
    }

    setDialog(null);
    showToast("Stock updated successfully");
    setRefreshKey(refreshKey + 1);
    loadProducts();
    loadLowStock();
  };

  const openHistory = (product) => {
    setHistoryProduct(product);
    setTab("history");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSearch("");
    setStockFilter("All");
    setPage(0);
  };

  const showLowStockOnly = () => {
    setStockFilter("LOW_STOCK");
    setPage(0);
  };

  return (
    <div className="inv-page">
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="inv-header">
        <span className="inv-eyebrow">VENDOR CRM</span>
        <h1>INVENTORY</h1>
        
      </div>

      {lowStock.length > 0 && (
        <div className="inv-alert">
          <div>
            <strong>
              {lowStock.length} product{lowStock.length !== 1 ? "s" : ""} running
              low or out of stock
            </strong>
            <div className="inv-alert-names">
              {lowStock.slice(0, 5).map((p) => (
                <span key={p.id}>
                  {p.name} ({p.stock})
                </span>
              ))}
              {lowStock.length > 5 && <span>+{lowStock.length - 5} more</span>}
            </div>
          </div>
          <button className="inv-alert-btn" onClick={showLowStockOnly}>
            View low stock
          </button>
        </div>
      )}

      <div className="inv-tabs">
        <button
          className={tab === "stock" ? "inv-tab inv-tab-active" : "inv-tab"}
          onClick={() => setTab("stock")}
        >
          Stock Levels
        </button>
        <button
          className={tab === "history" ? "inv-tab inv-tab-active" : "inv-tab"}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      {tab === "history" ? (
        <InventoryHistory
          productId={historyProduct ? historyProduct.id : null}
          productName={historyProduct ? historyProduct.name : ""}
          onShowAll={() => setHistoryProduct(null)}
          refreshKey={refreshKey}
        />
      ) : (
        <>
          <div className="inv-filters">
            <input
              className="inv-search"
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="inv-select"
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="All">All Stock</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>

            {(searchTerm !== "" || stockFilter !== "All") && (
              <button className="inv-reset" onClick={resetFilters}>
                Reset
              </button>
            )}
          </div>

          {!loading && !error && (
            <div className="inv-count">
              Showing <strong>{totalItems}</strong> product
              {totalItems !== 1 ? "s" : ""}
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={loadProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No Products Found"
              message="No products match your search or stock filter."
              onReset={resetFilters}
            />
          ) : (
            <div className="inv-table-wrap">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>IMAGE</th>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>VENDOR</th>
                    <th>STOCK</th>
                    <th>LOW STOCK LEVEL</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="inv-img"
                          />
                        ) : (
                          <div className="inv-img inv-img-empty">
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="inv-name">{product.name}</div>
                        <div className="inv-sku">{product.sku}</div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.vendor}</td>
                      <td className="inv-stock">{product.stock}</td>
                      <td>{product.lowStockThreshold}</td>
                      <td>
                        <span
                          className={`inv-badge ${statusClass[product.stockStatus]}`}
                        >
                          {statusText[product.stockStatus]}
                        </span>
                      </td>
                      <td>
                        <div className="inv-row-actions">
                          <button
                            className="inv-btn inv-btn-in"
                            onClick={() => setDialog({ type: "in", product })}
                          >
                            Stock In
                          </button>
                          <button
                            className="inv-btn inv-btn-out"
                            onClick={() => setDialog({ type: "out", product })}
                          >
                            Stock Out
                          </button>
                          <button
                            className="inv-btn"
                            onClick={() =>
                              setDialog({ type: "adjust", product })
                            }
                          >
                            Adjust
                          </button>
                          <button
                            className="inv-btn"
                            onClick={() => openHistory(product)}
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="inv-pager">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                ← Previous
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {dialog && (
        <StockDialog
          type={dialog.type}
          product={dialog.product}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
};

export default Inventory;