const API = "http://localhost:8080/api";

async function request(path, options = {}) {
  const res = await fetch(API + path, options);

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || "Something went wrong";
    throw new Error(message);
  }
  return data;
}

function postJson(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const getVendors = () => request("/vendors");

export const createCategory = (name) => postJson("/categories", { name });

export const createBrand = (name) => postJson("/brands", { name });

export const createVendor = (name, email, phone) =>
  postJson("/vendors", { name, email, phone });

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const data = await request("/files/upload", { method: "POST", body: formData });
  return data.url;
};