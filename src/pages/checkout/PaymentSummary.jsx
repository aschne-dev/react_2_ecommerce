import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatMoney } from "../../utils/money";

export default function PaymentSummary({ paymentSummary }) {
  // STATE
  const { loadCart } = useCart(); // Context ensures cart refresh happens app-wide.

  // COMPORTEMENTS
  const navigate = useNavigate();

  const createOrder = async () => {
    await api.post("/orders");
    await loadCart();
    navigate("/orders");
  };

  // RENDER
  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>

      {paymentSummary && (
        <>
          <div
            className="payment-summary-row"
            data-testid="payment-summary-container"
          >
            <div>Items ({paymentSummary.totalItems}):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.productCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row"
            data-testid="payment-summary-container"
          >
            <div>Shipping &amp; handling:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.shippingCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row subtotal-row"
            data-testid="payment-summary-container"
          >
            <div>Total before tax:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
            </div>
          </div>

          <div
            className="payment-summary-row"
            data-testid="payment-summary-container"
          >
            <div>Estimated tax (10%):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.taxCents)}
            </div>
          </div>

          <div
            className="payment-summary-row total-row"
            data-testid="payment-summary-container"
          >
            <div>Order total:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostCents)}
            </div>
          </div>

          <button
            className="place-order-button button-primary"
            data-testid="create-order-button"
            onClick={createOrder}
          >
            Place your order
          </button>
        </>
      )}
    </div>
  );
}
