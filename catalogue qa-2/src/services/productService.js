import api from "./api";

const cleanParams = (params) => {
  const result = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== "" && value !== null && value !== undefined) {
      result[key] = value;
    }
  });
  return result;
};

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params: cleanParams(params) });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get("/brands");
  return response.data;
};

export const getVendors = async () => {
  const response = await api.get("/vendors");
  return response.data;
};
export const createCategory = async (name) => {
  const response = await api.post("/categories", { name });
  return response.data;
};

export const createBrand = async (name) => {
  const response = await api.post("/brands", { name });
  return response.data;
};

export const createVendor = async (name, email = "", phone = "") => {
  const response = await api.post("/vendors", {
    name,
    email: email || null,
    phone: phone || null,
  });
  return response.data;
};