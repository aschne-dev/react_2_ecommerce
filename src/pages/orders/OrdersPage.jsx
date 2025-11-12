import Header from "../../components/Header";
import "./OrdersPage.css";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import OrdersGrid from "./OrdersGrid";

export default function OrdersPage({ cart, loadCart }) {
  // STATE
  const [orders, setOrders] = useState([]);

  // COMPORTEMENTS
  useEffect(() => {
    const fetchOrdersData = async () => {
      const response = await api.get("/orders?expand=products");
      setOrders(response.data);
    };

    fetchOrdersData();
  }, []);

  // RENDER
  return (
    <>
      <title>Orders</title>
      <link rel="icon" type="image/svg+xml" href="/orders-favicon.png" />
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <OrdersGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  );
}
