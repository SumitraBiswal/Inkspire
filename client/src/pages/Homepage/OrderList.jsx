import React, { useEffect } from "react";
import "../Style/OrderList.css";
import { useOrder } from "../../Context/OrderContext.jsx";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const { orders, fetchOrders, loading, cancelOrder } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (confirmCancel) cancelOrder(id);
  };

  const handleView = (id) => {
    navigate(`/order/${id}`);
  };

  if (loading) return <p className="loader">Loading orders...</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">No orders placed yet.</p>;

  return (
    <div className="order-page">
      <h2 className="order-title">My Orders</h2>

      <div className="orders-container">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            <div className="order-header">
              <span className="order-id">#{order._id}</span>
              <span
                className={`status-badge ${
                  order.status === "Cancelled" ? "cancel-status" : "active-status"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-info">
              <p><strong>Order Date:</strong> {new Date(order.orderAt).toLocaleDateString()}</p>
              <p><strong>Delivery:</strong> {new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
            </div>

            <div className="items-box">
              <h4>Items</h4>
              {order.items.map((item, i) => (
                <div key={i} className="item-row">
                  <span>{item.bookId?.title || "Book"}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="address-box">
              <h4>Delivery Address</h4>
              <p>{order.address.fullName}</p>
              <p>
                {order.address.house}, {order.address.city},{" "}
                {order.address.state} - {order.address.pincode}
              </p>
              <p>Phone: {order.address.phone}</p>
            </div>

            <div className="order-footer">
              <p className="total-price">₹ {order.totalPrice}</p>

              <div className="buttons-row">
                <button className="view-btn" onClick={() => handleView(order._id)}>
                  View Details
                </button>

                {order.status !== "Cancelled" && (
                  <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;