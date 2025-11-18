import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { buildAssetUrl } from "../../lib/assets";
import { addCartItem } from "../../lib/api";
import { useCartStore } from "../../store/CartStore";
import { formatMoney } from "../../utils/money";

export default function Product({ product }) {
  //STATE
  const queryClient = useQueryClient();
  const setLastAddedProductId = useCartStore(
    (state) => state.setLastAddedProductId
  );
  const [quantity, setQuantity] = useState(1);
  const [productAdded, setProductAdded] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["payment-summary"] }),
      ]);
    },
  });

  // COMPORTEMENTS
  const addToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity,
      });
      setProductAdded(true);
      setLastAddedProductId(product.id);
      setTimeout(() => {
        setProductAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to add product to cart", error);
    }
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  // RENDER
  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={buildAssetUrl(product.image)}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={buildAssetUrl(
            `images/ratings/rating-${product.rating.stars * 10}.png`
          )}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        <select
          value={quantity}
          onChange={selectQuantity}
          data-testid="quantity-selector"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className="added-to-cart" style={{ opacity: productAdded ? 1 : 0 }}>
        <img src={buildAssetUrl("images/icons/checkmark.png")} />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
