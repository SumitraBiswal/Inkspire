import React, { useState, useEffect } from "react";
import "../Style/Address.css";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../Context/OrderContext.jsx";

const Address = () => {
  const navigate = useNavigate();
  const {
    addresses,
    selectedAddress,
    selectAddress,
    addAddress,
  } = useOrder();

  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Save New Address
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    await addAddress(form);
    setForm({
      fullName: "",
      phone: "",
      house: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    });
    setAddingNew(false);
  };

  // Use current location
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setForm({
        ...form,
        landmark: `Current Location: https://maps.google.com/?q=${latitude},${longitude}`,
      });
      alert("Current location selected!");
    });
  };

  return (
    <div className="address-page">
      <h2>Select Delivery Address</h2>

      {/* Saved Addresses */}
      {addresses.length > 0 &&
        addresses.map((addr) => (
          <div key={addr._id} className="address-card">
            <input
              type="radio"
              checked={selectedAddress?._id === addr._id}
              onChange={() => selectAddress(addr)}
            />
            <div>
              <h4>{addr.fullName}</h4>
              <p>
                {addr.house}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p>Phone: {addr.phone}</p>
              {addr.landmark && (
                <p>
                  Landmark:{" "}
                  <a
                    href={addr.landmark.split("Current Location: ")[1]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Map
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}

      <button className="add-address-btn" onClick={() => setAddingNew(true)}>
        + Add New Address
      </button>

      {/* New Address Form */}
      {addingNew && (
        <div className="address-form">
          <h3>Add New Address</h3>
          <button className="gps-btn" onClick={handleCurrentLocation}>
            📍 Use Current Location (Google Map)
          </button>

          <form onSubmit={handleSaveNewAddress}>
            <input
              required
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="House / Flat / Street"
              value={form.house}
              onChange={(e) => setForm({ ...form, house: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              required
              type="number"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Landmark (optional)"
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            />
            <button type="submit" className="save-btn">
              Save Address
            </button>
          </form>
        </div>
      )}

      <button
        className="continue-btn"
        disabled={!selectedAddress}
        onClick={() =>
          navigate("/payment", { state: { address: selectedAddress } })
        }
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Address;