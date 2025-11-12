import { api } from "../lib/api";

export async function addProductToCart(productId, quantity = 1, loadCart) {
  await api.post("/cart-items", {
    productId,
    quantity,
  });

  await loadCart();
}
