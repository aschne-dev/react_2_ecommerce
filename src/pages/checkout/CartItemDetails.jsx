import { useState } from "react";
import { api } from "../../lib/api";
import { buildAssetUrl } from "../../lib/assets";
import { formatMoney } from "../../utils/money";

export default function CartItemDetails({
  cartItem,
  deleteCartItem,
  loadCart,
}) {
  // STATE
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

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
    await api.put(`/cart-items/${cartItem.product.id}`, {
      quantity: quantitySelected,
    });
    await loadCart();
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
