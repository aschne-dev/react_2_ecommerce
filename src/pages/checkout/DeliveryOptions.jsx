import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { updateCartItemDeliveryOption } from "../../lib/api";
import { formatMoney } from "../../utils/money";

export default function DeliveryOptions({ cartItem, deliveryOptions }) {
  const queryClient = useQueryClient();
  const updateDeliveryOptionMutation = useMutation({
    mutationFn: updateCartItemDeliveryOption,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["payment-summary"] }),
      ]);
    },
  });

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          try {
            await updateDeliveryOptionMutation.mutateAsync({
              productId: cartItem.productId,
              deliveryOptionId: deliveryOption.id,
            });
          } catch (error) {
            console.error("Unable to update delivery option", error);
          }
        };

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={updateDeliveryOption}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
