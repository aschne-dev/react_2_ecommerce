import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem } from "../../lib/api";
import { useCartStore } from "../../store/CartStore";
import CartItemDetails from "./CartItemDetails";
import DeliveryDate from "./DeliveryDate";
import DeliveryOptions from "./DeliveryOptions";

export default function OrderSummary({ deliveryOptions }) {
  const cart = useCartStore((state) => state.cart);
  const queryClient = useQueryClient();
  const deleteCartItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["payment-summary"] }),
      ]);
    },
  });

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

          const deleteCartItemHandler = async () => {
            try {
              await deleteCartItemMutation.mutateAsync({
                productId: cartItem.productId,
              });
            } catch (error) {
              console.error("Unable to delete cart item", error);
            }
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
                  deleteCartItem={deleteCartItemHandler}
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
