import { useQuery } from "@tanstack/react-query";
import CheckoutHeader from "./CheckoutHeader";
import "./CheckoutPage.css";
import OrderSummary from "./OrderSummary";
import PaymentSummary from "./PaymentSummary";
import { useEffect } from "react";
import {
  fetchCartItems,
  fetchDeliveryOptions,
  fetchPaymentSummary,
} from "../../lib/api";
import { useCartStore } from "../../store/CartStore";

export default function CheckoutPage() {
  const setCart = useCartStore((state) => state.setCart);
  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartItems,
  });

  useEffect(() => {
    if (cartData !== undefined) {
      setCart(cartData ?? []);
    }
  }, [cartData, setCart]);

  const { data: deliveryOptions, isLoading: isDeliveryOptionsLoading } =
    useQuery({
      queryKey: ["delivery-options"],
      queryFn: fetchDeliveryOptions,
    });

  const { data: paymentSummary, isLoading: isPaymentSummaryLoading } = useQuery(
    {
      queryKey: ["payment-summary"],
      queryFn: fetchPaymentSummary,
    }
  );

  const effectiveDeliveryOptions = deliveryOptions ?? [];
  const isLoadingCheckoutData =
    isCartLoading || isDeliveryOptionsLoading || isPaymentSummaryLoading;

  // RENDER
  return (
    <>
      <title>Checkout</title>
      <link rel="icon" type="image/svg+xml" href="/cart-favicon.png" />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <CheckoutHeader paymentSummary={paymentSummary} />

        {isLoadingCheckoutData ? (
          <p className="loading-message">Chargement du panier...</p>
        ) : (
          <div className="checkout-grid">
            <OrderSummary deliveryOptions={effectiveDeliveryOptions} />
            <PaymentSummary paymentSummary={paymentSummary} />
          </div>
        )}
      </div>
    </>
  );
}
