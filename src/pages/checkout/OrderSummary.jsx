import { useCartStore } from "../../store/CartStore";
import { api } from "../../lib/api";
import CartItemDetails from "./CartItemDetails";
import DeliveryDate from "./DeliveryDate";
import DeliveryOptions from "./DeliveryOptions";

export default function OrderSummary({ deliveryOptions }) {
  // STATE
  const cart = useCartStore((state) => state.cart);
  const loadCart = useCartStore((state) => state.loadCart);

  // RENDER
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          const selectedDeliveryOption = deliveryOptions.find(
            (deliveryOption) => {
              return deliveryOption.id === cartItem.deliveryOptionId;
            }
          );

          const deleteCartItem = async () => {
            await api.delete(`/cart-items/${cartItem.productId}`);
            await loadCart();
          };

          return (
            <div key={cartItem.productId} className="cart-item-container">
              <DeliveryDate
                estimatedDeliveryTimeMs={
                  selectedDeliveryOption.estimatedDeliveryTimeMs
                }
              />

              <div className="cart-item-details-grid">
                <CartItemDetails
                  cartItem={cartItem}
                  deleteCartItem={deleteCartItem}
                />

                <DeliveryOptions
                  cartItem={cartItem}
                  deliveryOptions={deliveryOptions}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
