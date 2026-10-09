import api from "./api";

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