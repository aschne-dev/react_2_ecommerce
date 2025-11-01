import dayjs from "dayjs";

export default function DeliveryDate({ estimatedDeliveryTimeMs }) {
  return (
    <div className="delivery-date">
      Delivery date:
      {dayjs(estimatedDeliveryTimeMs).format("dddd, MMMM D")}
    </div>
  );
}
