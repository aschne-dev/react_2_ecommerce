import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { buildAssetUrl } from "../../lib/assets";
import { updateCartItemQuantity } from "../../lib/api";
import { formatMoney } from "../../utils/money";

export default function CartItemDetails({ cartItem, deleteCartItem }) {
  const queryClient = useQueryClient();
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const updateCartMutation = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["payment-summary"] }),
      ]);
    },
  });

  // COMPORTEMENTS
  const isUpdatingQuantity = () => {
    if (showQuantityInput) {
      updateCart();
      setShowQuantityInput(false);
    } else {
      setShowQuantityInput(true);
    }
  };

  const changeQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const quantityKeyDown = (event) => {
    if (event.key === "Enter") {
      isUpdatingQuantity();
    } else if (event.key === "Escape") {
      setQuantity(cartItem.quantity);
      setShowQuantityInput(false);
    }
  };

  const updateCart = async () => {
    const quantitySelected = Number(quantity);
    try {
      await updateCartMutation.mutateAsync({
        productId: cartItem.product.id,
        quantity: quantitySelected,
      });
    } catch (error) {
      console.error("Unable to update cart item quantity", error);
    }
  };

  // RENDER
  return (
    <>
      <img
        className="product-image"
        src={buildAssetUrl(cartItem.product.image)}
      />

      <div className="cart-item-details">
        <div className="product-name">{cartItem.product.name}</div>
        <div className="product-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Quantity:
            {showQuantityInput ? (
              <input
                type="text"
                value={quantity}
                onChange={changeQuantity}
                onKeyDown={quantityKeyDown}
              />
            ) : (
              <span className="quantity-label">{cartItem.quantity}</span>
            )}
          </span>
          <span
            className="update-quantity-link link-primary"
            onClick={isUpdatingQuantity}
          >
            Update
          </span>
          <span
            className="delete-quantity-link link-primary"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
}
