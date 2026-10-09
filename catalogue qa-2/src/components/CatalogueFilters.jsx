import React from "react";

const CatalogueFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  stockFilter,
  setStockFilter,
  sortBy,
  setSortBy,
  categories,
  brands,
  onClearFilters,
}) => {
  return (
    <div className="catalogue-filters">
      
      {/* Search */}
      <div className="filter-group search-group">
        <label>Search</label>

        <input
          type="text"
          placeholder="Search product, SKU, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="filter-group">
        <label>Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>

          {categories?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="filter-group">
        <label>Brand</label>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="All">All Brands</option>

          {brands?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div className="filter-group">
        <label>Stock</label>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label>Sort By</label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-low">Price Low to High</option>
          <option value="price-high">Price High to Low</option>
          <option value="stock-low">Stock Low to High</option>
          <option value="stock-high">Stock High to Low</option>
        </select>
      </div>

      {/* Clear */}
      <button
        className="clear-filters-btn"
        onClick={onClearFilters}
      >
        Clear
      </button>
    </div>
  );
};

export default CatalogueFilters;