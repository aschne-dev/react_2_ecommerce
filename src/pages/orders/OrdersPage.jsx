import Header from "../../components/Header";
import "./OrdersPage.css";

import axios from "axios";
import { useEffect, useState } from "react";
import OrdersGrid from "./OrdersGrid";

export default function OrdersPage({ cart }) {
  // STATE
  const [orders, setOrders] = useState([]);

  // COMPORTEMENTS
  useEffect(() => {
    const fetchOrdersData = async () => {
      const response = await axios.get("/api/orders?expand=products");
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

        <OrdersGrid orders={orders} />
      </div>
    </>
  );
}
