import { create } from "zustand";

const defaultState = {
  cart: [],
  lastAddedProductId: null,
};

export const useCartStore = create((set) => ({
  ...defaultState,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: [] }),
  setLastAddedProductId: (productId) =>
    set({ lastAddedProductId: productId ?? null }),
  reset: () => set({ ...defaultState }),
}));
