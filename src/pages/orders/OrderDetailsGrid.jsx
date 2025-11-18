import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Fragment } from "react";
import { Link } from "react-router";
import buyAgainIcon from "../../assets/images/icons/buy-again.png";
import { buildAssetUrl } from "../../lib/assets";
import { addCartItem } from "../../lib/api";

export default function OrderDetailsGrid({ order }) {
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["payment-summary"] }),
      ]);
    },
  });

  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        const addToCart = async () => {
          try {
            await addToCartMutation.mutateAsync({
              productId: orderProduct.product.id,
              quantity: 1,
            });
          } catch (error) {
            console.error("Unable to add product to cart from orders", error);
          }
        };

        return (
          <Fragment key={orderProduct.product.id}>
            <div className="product-image-container">
              <img src={buildAssetUrl(orderProduct.product.image)} />
            </div>

            <div className="product-details">
              <div className="product-name">{orderProduct.product.name}</div>
              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button
                className="buy-again-button button-primary"
                onClick={addToCart}
              >
                <img className="buy-again-icon" src={buyAgainIcon} />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              <Link to={`/tracking/${order.id}/${orderProduct.product.id}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
