import axios from "axios";

export async function addProductToCart(productId, quantity = 1, loadCart) {
  await axios.post("/api/cart-items", {
    productId,
    quantity,
  });

  await loadCart();
}
