import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/api.js"; // <-- use your api.js instance
import { toast } from "react-toastify";
import { useCart } from "./CartContext.jsx";


const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { cart, clearCart } = useCart();

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails,setOrderDetails]=useState(null);

  // -------- Address Actions --------
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      if (res.data.success) {
        setAddresses(res.data.addresses);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
      console.error(error);
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await api.post("/address", addressData);
      if (res.data.success) {
        setAddresses((prev) => [res.data.address, ...prev]);
        setSelectedAddress(res.data.address);
        toast.success("Address added successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to add address");
      console.error(error);
    }
  };

  const updateAddress = async (id, updatedData) => {
    try {
      const res = await api.put(`/address/${id}`, updatedData);
      if (res.data.success) {
        setAddresses((prev) =>
          prev.map((addr) => (addr._id === id ? res.data.address : addr))
        );
        if (selectedAddress?._id === id) setSelectedAddress(res.data.address);
        toast.success("Address updated successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update address");
      console.error(error);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await api.delete(`/address/${id}`);
      if (res.data.success) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== id));
        if (selectedAddress?._id === id) setSelectedAddress(null);
        toast.success("Address deleted successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete address");
      console.error(error);
    }
  };

  const selectAddress = (addr) => setSelectedAddress(addr);

  // -------- Order Actions --------
  const placeOrder = async (PaymentMethod) => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return null;
    }
    if (!PaymentMethod) {
      toast.error("Please select a payment method");
      return null;
    }

    try {
      setLoading(true);
      const body = {
        items: cart.items.map((i) => ({
          bookId: i.bookId,
          quantity: i.quantity,
          price: i.price,
        })),
        address: selectedAddress,
        PaymentMethod,
        totalPrice: cart.totalPrice,
      };

      const res = await api.post("/order/placeorder", body);
      setLoading(false);

      if (res.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        return res.data.orderId;
      } else {
        toast.error(res.data.message);
        return null;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to place order");
      console.error(error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/myorders");
      setLoading(false);

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch orders");
      console.error(error);
    }
  };

 
 const getOrderById = async (id) => {
  try {
    setLoading(true);
    const { data } = await api.get(`/order/order/${id}`);

    if (data.success) {
      setOrderDetails(data.order);
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error(error);
    toast.error("Failed to fetch order details");
  }
};

  const cancelOrder = async (id) => {
    try {
      const { data } = await api.put(`/order/cancel/${id}`);

      if (data.success) {
        toast.success("Order cancelled");
        
        fetchOrders();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      return false;
    }
  };


  useEffect(() => {
    fetchAddresses();
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        orders,
        orderDetails,
        placeOrder,
        fetchOrders,
        getOrderById,
        cancelOrder,
        loading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};