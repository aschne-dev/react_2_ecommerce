import { useEffect, useState } from "react";
import { useCartStore } from "../../store/CartStore";
import { api } from "../../lib/api";
import CheckoutHeader from "./CheckoutHeader";
import "./CheckoutPage.css";
import OrderSummary from "./OrderSummary";
import PaymentSummary from "./PaymentSummary";

export default function CheckoutPage() {
  // STATE
  const cart = useCartStore((state) => state.cart);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  // COMPORTEMENTS
  useEffect(() => {
    const fetchCheckoutData = async () => {
      const response = await api.get(
        "/delivery-options?expand=estimatedDeliveryTime"
      );
      setDeliveryOptions(response.data);
    };

    fetchCheckoutData();
  }, []);

  useEffect(() => {
    const updatePaymentSummary = async () => {
      const response = await api.get("/payment-summary");
      setPaymentSummary(response.data);
    };

    updatePaymentSummary();
  }, [cart]);

  // RENDER
  return (
    <>
      <title>Checkout</title>
      <link rel="icon" type="image/svg+xml" href="/cart-favicon.png" />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <CheckoutHeader paymentSummary={paymentSummary} />

        <div className="checkout-grid">
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions} />
          <PaymentSummary paymentSummary={paymentSummary} />
        </div>
      </div>
    </>
  );
}
