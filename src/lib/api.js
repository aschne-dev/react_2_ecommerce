import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchProducts = async ({ page = 1, search = "" } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) {
    params.set("search", search);
  }

  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const fetchCartItems = async () => {
  const response = await api.get("/cart-items?expand=product");
  return response.data;
};

export const addCartItem = async ({ productId, quantity }) => {
  return api.post("/cart-items", { productId, quantity });
};

export const updateCartItemQuantity = async ({ productId, quantity }) => {
  return api.put(`/cart-items/${productId}`, { quantity });
};

export const updateCartItemDeliveryOption = async ({
  productId,
  deliveryOptionId,
}) => {
  return api.put(`/cart-items/${productId}`, { deliveryOptionId });
};

export const deleteCartItem = async ({ productId }) => {
  return api.delete(`/cart-items/${productId}`);
};

export const fetchDeliveryOptions = async () => {
  const response = await api.get("/delivery-options?expand=estimatedDeliveryTime");
  return response.data;
};

export const fetchPaymentSummary = async () => {
  const response = await api.get("/payment-summary");
  return response.data;
};

export const createOrder = async () => {
  return api.post("/orders");
};

export const fetchOrders = async () => {
  const response = await api.get("/orders?expand=products");
  return response.data;
};

export const fetchOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}?expand=products`);
  return response.data;
};
