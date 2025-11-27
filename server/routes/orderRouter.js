import express from "express";
import userAuth from "../middleware/userAuth.js";
import { cancelOrder, getMyOrders, getOrderById, placeOrder } from "../controllers/orderController.js";



const orderRouter=express.Router();
orderRouter.post("/placeorder",userAuth,placeOrder);
orderRouter.get("/myorders",userAuth,getMyOrders);
orderRouter.get("/order/:id",userAuth,getOrderById);
orderRouter.put("/cancel/:id",userAuth,cancelOrder);

export default orderRouter;