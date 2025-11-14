import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../lib/api";
import { CartContext } from "./CartContext";

// Centralizes cart state so every page can access fresh cart data/loading helpers.
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Always load the cart through the API so local state mirrors the backend.
  const loadCart = useCallback(async () => {
    const response = await api.get("/cart-items?expand=product");
    setCart(response.data);
  }, []);

  // Fetch the cart once on mount so initial renders show server data.
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const value = useMemo(
    () => ({
      cart,
      loadCart,
    }),
    [cart, loadCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
