import CartItemDetails from "./CartItemDetails";
import DeliveryDate from "./DeliveryDate";
import DeliveryOptions from "./DeliveryOptions";

export default function OrderSummary({ cart, deliveryOptions }) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          const selectedDeliveryOption = deliveryOptions.find(
            (deliveryOption) => {
              return deliveryOption.id === cartItem.deliveryOptionId;
            }
          );

          return (
            <div key={cartItem.productId} className="cart-item-container">
              <DeliveryDate
                estimatedDeliveryTimeMs={
                  selectedDeliveryOption.estimatedDeliveryTimeMs
                }
              />

              <div className="cart-item-details-grid">
                <CartItemDetails cartItem={cartItem} />

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
