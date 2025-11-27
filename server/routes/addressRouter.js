import express from "express";
import userAuth from "../middleware/userAuth.js";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/Addresscontroller.js";

const addressRouter = express.Router();

addressRouter.post("/", userAuth, addAddress);


addressRouter.get("/", userAuth, getAddresses);


addressRouter.put("/:id", userAuth, updateAddress);


addressRouter.delete("/:id", userAuth, deleteAddress);

export default addressRouter;