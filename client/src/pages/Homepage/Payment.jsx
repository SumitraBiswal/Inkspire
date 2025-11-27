import React, { useState } from "react";
import "../Style/Payment.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../../Context/OrderContext.jsx";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAddress, placeOrder, loading } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePlaceOrder = async () => {
    const orderId = await placeOrder(paymentMethod);
    if (orderId) {
      navigate("/orders");
    }
  };

  const address = location.state?.address || selectedAddress;

  return (
    <div className="payment-page">
      <h2>Choose payment method</h2>

      <div className="address-box">
        <h3>Deliver To:</h3>
        <p>
          <b>{address?.fullName}</b>
        </p>
        <p>
          {address?.house}, {address?.city}, {address?.pincode}
        </p>
        <p>Phone: {address?.phone}</p>
      </div>

      <div className="payment-box">
        {["COD", "UPI", "CARD"].map((method) => (
          <div
            key={method}
            className={`payment-option ${paymentMethod === method ? "active" : ""}`}
            onClick={() => setPaymentMethod(method)}
          >
            <input type="radio" checked={paymentMethod === method} readOnly />
            <label>
              {method === "COD"
                ? "Cash On Delivery"
                : method === "UPI"
                ? "UPI Payment (GPay / PhonePe / Paytm)"
                : "Debit / Credit Card"}
            </label>
          </div>
        ))}
      </div>

      <button
        className="confirm-btn"
        disabled={loading}
        onClick={handlePlaceOrder}
      >
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default Payment;