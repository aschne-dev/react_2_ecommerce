import Header from "../../components/Header";
import "./OrdersPage.css";

import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../lib/api";
import OrdersGrid from "./OrdersGrid";

export default function OrdersPage() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // RENDER
  return (
    <>
      <title>Orders</title>
      <link rel="icon" type="image/svg+xml" href="/orders-favicon.png" />
      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {isLoading && <p>Chargement...</p>}
        {error && (
          <p className="error-message">
            Impossible de charger vos commandes.
          </p>
        )}
        {orders && <OrdersGrid orders={orders} />}
      </div>
    </>
  );
}
