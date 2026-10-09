// import api from "./api";

// export const stockIn = async (id, quantity, reason) => {
//   const response = await api.post(`/inventory/products/${id}/stock-in`, {
//     quantity,
//     reason,
//   });
//   return response.data;
// };

// export const stockOut = async (id, quantity, reason) => {
//   const response = await api.post(`/inventory/products/${id}/stock-out`, {
//     quantity,
//     reason,
//   });
//   return response.data;
// };

// export const adjustStock = async (id, quantity, reason) => {
//   const response = await api.post(`/inventory/products/${id}/adjust`, {
//     quantity,
//     reason,
//   });
//   return response.data;
// };

// export const getLowStock = async () => {
//   const response = await api.get("/inventory/low-stock");
//   return response.data;
// };

// export const getHistory = async (productId, page, size) => {
//   const params = { page, size };
//   if (productId) {
//     params.productId = productId;
//   }
//   const response = await api.get("/inventory/history", { params });
//   return response.data;
// };


import api from "./api";

// =========================
// STOCK APIs
// =========================

export const stockIn = async (id, quantity, reason) => {
  const response = await api.post(`/inventory/products/${id}/stock-in`, {
    quantity,
    reason,
  });

  return response.data;
};

export const stockOut = async (id, quantity, reason) => {
  const response = await api.post(`/inventory/products/${id}/stock-out`, {
    quantity,
    reason,
  });

  return response.data;
};

export const adjustStock = async (id, quantity, reason) => {
  const response = await api.post(`/inventory/products/${id}/adjust`, {
    quantity,
    reason,
  });

  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get("/inventory/low-stock");
  return response.data;
};

export const getHistory = async (productId, page, size) => {
  const params = { page, size };

  if (productId) {
    params.productId = productId;
  }

  const response = await api.get("/inventory/history", { params });

  return response.data;
};


// =========================
// CATEGORY APIs
// =========================

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (name) => {
  const response = await api.post("/categories", {
    name,
  });

  return response.data;
};


// =========================
// BRAND APIs
// =========================

export const getBrands = async () => {
  const response = await api.get("/brands");
  return response.data;
};

export const createBrand = async (name) => {
  const response = await api.post("/brands", {
    name,
  });

  return response.data;
};


// =========================
// VENDOR APIs
// =========================

export const getVendors = async () => {
  const response = await api.get("/vendors");
  return response.data;
};

export const createVendor = async (name) => {
  const response = await api.post("/vendors", {
    name,
  });

  return response.data;
};