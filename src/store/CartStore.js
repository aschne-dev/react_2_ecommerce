import { create } from "zustand";
import { api } from "../lib/api";

const defaultState = {
  cart: [],
  isLoading: false,
  error: null,
};

export const useCartStore = create((set, get) => ({
  ...defaultState,
  loadCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/cart-items?expand=product");
      set({ cart: response.data });
      return response.data;
    } catch (error) {
      set({ error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  addProduct: async (productId, quantity = 1) => {
    set({ error: null });
    try {
      await api.post("/cart-items", {
        productId,
        quantity,
      });
      await get().loadCart();
    } catch (error) {
      set({ error });
      throw error;
    }
  },
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: [] }),
  reset: () => set({ ...defaultState }),
}));
