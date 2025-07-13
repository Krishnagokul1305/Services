import axios from "@/lib/axios";

export async function getProducts() {
  const res = await axios.get("/products");
  return res.data.data;
}

export async function getProductById(productId) {
  const res = await axios.get(`/${productId}`);
  return res.data.data;
}
