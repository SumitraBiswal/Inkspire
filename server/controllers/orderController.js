import Order from "../models/orderModel.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const { items, address, PaymentMethod, totalPrice } = req.body;

  
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items found" });
    }

    if (!PaymentMethod) {
      return res.json({ success: false, message: "Payment method required" });
    }

    // Create Order
    const order = new Order({
      userId: req.userId,  
      items,
      address,
      PaymentMethod,
      totalPrice
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      message: "Order added successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ALL ORDERS 
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ orderAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET SINGLE ORDER DETAILS
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.userId  
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.userId
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.json({ success: false, message: "Order already cancelled" });
    }

    if (order.status === "Delivered") {
      return res.json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};