const ProductStatus = ({ status }) => {
  const value = status || "UNKNOWN";
  const statusClass = value.toLowerCase();
  const label = value.charAt(0) + value.slice(1).toLowerCase();

  return (
    <span className={`product-status ${statusClass}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
};

export default ProductStatus;