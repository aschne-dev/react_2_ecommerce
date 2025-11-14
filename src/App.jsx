import { Route, Routes } from "react-router";
import "./App.css";
import { CartProvider } from "./context/CartProvider";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import HomePage from "./pages/home/HomePage";
import NotFound from "./pages/NotFound";
import OrdersPage from "./pages/orders/OrdersPage";
import TrackingPage from "./pages/TrackingPage";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route
          path="/tracking/:orderId/:productId"
          element={<TrackingPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
