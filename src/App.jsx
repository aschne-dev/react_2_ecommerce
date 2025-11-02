import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import HomePage from "./pages/home/HomePage";
import NotFound from "./pages/NotFound";
import OrdersPage from "./pages/orders/OrdersPage";
import TrackingPage from "./pages/TrackingPage";

function App() {
  // STATE
  const [cart, setCart] = useState([]);

  // COMPORTEMENTS
  useEffect(() => {
    const getCartData = async () => {
      const response = await axios.get("api/cart-items?expand=product");
      setCart(response.data);
    };

    getCartData();
  }, []);

  // RENDER
  return (
    <Routes>
      <Route index element={<HomePage cart={cart} />} />
      <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
      <Route path="/orders" element={<OrdersPage cart={cart} />} />
      <Route
        path="/tracking/:orderId/:productId"
        element={<TrackingPage cart={cart} />}
      />
      <Route path="*" element={<NotFound cart={cart} />} />
    </Routes>
  );
}

export default App;
