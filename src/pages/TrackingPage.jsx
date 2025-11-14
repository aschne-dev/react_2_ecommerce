import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Header from "../components/Header";
import { api } from "../lib/api";
import { buildAssetUrl } from "../lib/assets";
import "./TrackingPage.css";

export default function TrackingPage() {
  // IDs coming from the URL (e.g. /tracking/:orderId/:productId)
  const { orderId, productId } = useParams();
  // Full order returned by the API
  const [order, setOrder] = useState(null);
  // Specific product we want to track on this page
  const [trackedProduct, setTrackedProduct] = useState(null);

  // Memoize delivery progress as long as the order or product stay the same
  const deliveryPercent = useMemo(() => {
    if (!order || !trackedProduct) return 0;

    const orderPlacedMs = dayjs(order.orderTimeMs).valueOf();
    const deliveryEtaMs = dayjs(
      trackedProduct.estimatedDeliveryTimeMs
    ).valueOf();
    const totalDeliveryTimeMs = deliveryEtaMs - orderPlacedMs;

    if (totalDeliveryTimeMs <= 0) {
      return deliveryEtaMs <= orderPlacedMs ? 100 : 0;
    }

    const timePassedMs = dayjs().valueOf() - orderPlacedMs;
    const percent = (timePassedMs / totalDeliveryTimeMs) * 100;

    // Clamp the result between 0 and 100 to avoid values outside the progress bar
    return Math.max(0, Math.min(percent, 100));
  }, [order, trackedProduct]);

  // Derive the current label shown under the progress bar
  const currentStatus = useMemo(() => {
    if (deliveryPercent >= 100) return "delivered";
    if (deliveryPercent >= 33) return "shipped";
    return "preparing";
  }, [deliveryPercent]);

  // Fetch the order whenever the orderId/productId parameters change
  useEffect(() => {
    const fetchTrackingData = async () => {
      const response = await api.get(`/orders/${orderId}?expand=products`);

      const trackedProductCopy = response.data.products.find(
        // Pick the product that matches the productId provided in the URL
        (orderProduct) => orderProduct.productId === productId
      );

      setOrder(response.data);
      setTrackedProduct(trackedProductCopy);
    };

    fetchTrackingData();
  }, [orderId, productId]);

  // Do not render anything until the order and product have both loaded
  if (!trackedProduct || !order) return null;

  return (
    <>
      <title>Orders</title>
      <link rel="icon" type="image/svg+xml" href="/tracking-favicon.png" />
      <Header />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? "Delivered on " : "Arriving on "}

            {dayjs(trackedProduct.estimatedDeliveryTimeMs).format("MMMM D")}
          </div>

          <div className="product-info">{trackedProduct.product.name}</div>

          <div className="product-info">
            Quantity: {trackedProduct.quantity}
          </div>

          <img
            className="product-image"
            src={buildAssetUrl(trackedProduct.product.image)}
          />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${
                currentStatus === "preparing" ? "current-status" : ""
              }`}
            >
              Preparing
            </div>
            <div
              className={`progress-label ${
                currentStatus === "shipped" ? "current-status" : ""
              }`}
            >
              Shipped
            </div>
            <div
              className={`progress-label ${
                currentStatus === "delivered" ? "current-status" : ""
              }`}
            >
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
