import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("userName", response.data.name);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
};