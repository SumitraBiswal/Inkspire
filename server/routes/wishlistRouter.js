import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/get", userAuth, getWishlist);
wishlistRouter.post("/add", userAuth, addToWishlist);
wishlistRouter.delete("/remove/", userAuth, removeFromWishlist);

export default wishlistRouter;