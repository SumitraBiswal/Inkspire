import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import express from "express";
import userAuth from "../middleware/userAuth.js";

const cartRouter= express.Router();

cartRouter.post("/add-to-cart",userAuth, addToCart );
cartRouter.get("/get-cart",userAuth,getCart);
cartRouter.delete("/remove-from-cart",userAuth,removeFromCart);
cartRouter.delete("/clear-cart",userAuth,clearCart);
cartRouter.put("/update-cart",userAuth,updateCartItem);

export default cartRouter;
