import { Route, Routes } from "react-router";
import "./App.css";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;
