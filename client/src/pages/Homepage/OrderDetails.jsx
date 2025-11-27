import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "../../Context/OrderContext";


const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderById, orderDetails, loading } = useOrder();

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  if (loading || !orderDetails) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h2>Order Details</h2>

      <div style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        background: "#fff",
      }}>
        <h3>Order ID: {orderDetails._id}</h3>
        <p>Status: <strong>{orderDetails.status}</strong></p>
        <p>Order Date: {new Date(orderDetails.orderAt).toDateString()}</p>
        <p>Expected Delivery: {new Date(orderDetails.expectedDeliveryDate).toDateString()}</p>

        <hr />

        <h3>Items</h3>
        {orderDetails.items.map((item, index) => (
          <div key={index} style={{ paddingBottom: "10px" }}>
            <p><strong>Book:</strong> {item.bookId}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </div>
        ))}

        <hr />

        <h3>Delivery Address</h3>
        <p>{orderDetails.address.fullName}</p>
        <p>{orderDetails.address.house}</p>
        <p>{orderDetails.address.city}, {orderDetails.address.state}</p>
        <p>Pincode: {orderDetails.address.pincode}</p>
        <p>Phone: {orderDetails.address.phone}</p>

        <hr />

        <h3>Total Paid: ₹{orderDetails.totalPrice}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;