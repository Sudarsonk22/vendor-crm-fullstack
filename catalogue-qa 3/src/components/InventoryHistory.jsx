import React, { useEffect, useState } from "react";
import { getHistory } from "../services/inventoryService";
import { getErrorMessage } from "../services/api";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const typeText = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
};

const typeClass = {
  STOCK_IN: "inv-in",
  STOCK_OUT: "inv-out",
  ADJUSTMENT: "inv-low",
};

const formatDateTime = (value) => {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InventoryHistory = ({ productId, productName, onShowAll, refreshKey }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getHistory(productId, page, 10);
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setItems([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [productId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [productId, page, refreshKey]);

  return (
    <div>
      <div className="inv-history-head">
        <h3>
          {productName ? `History for ${productName}` : "All stock movements"}
        </h3>
        {productId && (
          <button className="inv-link" onClick={onShowAll}>
            Show all products
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <div className="inv-empty">No stock movements yet.</div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PRODUCT</th>
                <th>TYPE</th>
                <th>QUANTITY</th>
                <th>STOCK</th>
                <th>REASON</th>
                <th>DONE BY</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{formatDateTime(item.createdAt)}</td>
                  <td>
                    <div className="inv-name">{item.productName}</div>
                    <div className="inv-sku">{item.sku}</div>
                  </td>
                  <td>
                    <span className={`inv-badge ${typeClass[item.type]}`}>
                      {typeText[item.type]}
                    </span>
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.stockBefore} → <strong>{item.stockAfter}</strong>
                  </td>
                  <td>{item.reason || "-"}</td>
                  <td>{item.doneBy || "-"}</td>
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
    </div>
  );
};

export default InventoryHistory;