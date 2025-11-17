import { useEffect } from "react";
import App from "./App.jsx";
import { useCartStore } from "./store/CartStore";

export default function AppBootstrap() {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return <App />;
}
