import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getErrorMessage } from "../services/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="catalogue-page">
        <ErrorState message={error} onRetry={loadProduct} />
        <button className="reset-filter-btn" onClick={() => navigate("/")}>
          Back to catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="catalogue-page">
      <button className="reset-filter-btn" onClick={() => navigate("/")}>
        ← Back to catalogue
      </button>

      <h1>{product.name}</h1>
      <p>SKU: {product.sku}</p>
      <p>
        {product.category} · {product.brand} · {product.vendor}
      </p>
      <p>Price: ₹{Number(product.price).toLocaleString("en-IN")}</p>
      <p>
        Stock: {product.stock} ({product.stockStatus})
      </p>
    </div>
  );
};

export default ProductDetails;