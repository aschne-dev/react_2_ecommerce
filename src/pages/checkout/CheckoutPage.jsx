import { useEffect, useState } from "react";
import CheckoutHeader from "./CheckoutHeader";
import "./CheckoutPage.css";
import OrderSummary from "./OrderSummary";
import PaymentSummary from "./PaymentSummary";
import { api } from "../../lib/api";

export default function CheckoutPage({ cart, loadCart }) {
  // STATE
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
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}
