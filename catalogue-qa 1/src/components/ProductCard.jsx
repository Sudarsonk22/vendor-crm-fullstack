import ProductStatus from "./ProductStatus";
import ProductActions from "./ProductActions";

const ProductCard = ({ product }) => {
  return (
    <tr>
      <td>
        <div className="product-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span>📦</span>
          )}
        </div>
      </td>

      <td>
        <div className="product-name">
          <strong>{product.name}</strong>
          <span>{product.sku}</span>
        </div>
      </td>

      <td>{product.category}</td>

      <td>{product.brand}</td>

      <td>
        <strong>₹{product.price.toLocaleString("en-IN")}</strong>
      </td>

      <td>
        <span className="discount">
          {product.discount}% OFF
        </span>
      </td>

      <td>
        <span
          className={
            product.stock === 0
              ? "stock out"
              : product.stock <= 10
              ? "stock low"
              : "stock"
          }
        >
          {product.stock}
        </span>
      </td>

      <td>
        <ProductStatus status={product.status} />
      </td>

      <td>{product.vendor}</td>

      <td>{product.createdDate}</td>

      <td>
        <ProductActions product={product} />
      </td>
    </tr>
  );
};

export default ProductCard;