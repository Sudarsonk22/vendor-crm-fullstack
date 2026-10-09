import React from "react";
import ProductStatus from "./ProductStatus";
import ProductActions from "./ProductActions";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const stockInfo = (product) => {
  if (product.stockStatus === "OUT_OF_STOCK") {
    return { text: "Out of Stock", className: "out-stock" };
  }
  if (product.stockStatus === "LOW_STOCK") {
    return { text: `Low Stock (${product.stock})`, className: "low-stock" };
  }
  return { text: product.stock, className: "available-stock" };
};

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>SKU</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>STATUS</th>
            <th>VENDOR</th>
            <th>CREATED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const stock = stockInfo(product);

            return (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <div className="product-image-small">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className="image-placeholder-small"
                        style={{ display: product.imageUrl ? "none" : "flex" }}
                      >
                        IMG
                      </div>
                    </div>

                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-discount">
                        {Number(product.discount || 0)}% OFF
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="sku-text">{product.sku}</span>
                </td>

                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                  <span className="table-price">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                </td>

                <td>
                  <span className={`stock-text ${stock.className}`}>
                    {stock.text}
                  </span>
                </td>

                <td>
                  <ProductStatus status={product.status} />
                </td>

                <td>{product.vendor}</td>
                <td>{formatDate(product.createdAt)}</td>

                <td>
                  <ProductActions
                    product={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;