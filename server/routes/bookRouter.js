import Book from "../models/bookModel.js";
import express from "express";

const BookRouter = express.Router();

BookRouter.get("/get",async (req,res)=>{
    try{
      const books = await Book.find();
       res.status(200).json({success:true,message:"book fetch",books})
    }catch(error){
        res.status(500).json({success:false,message:"error.message"})
    }
})

export default BookRouter;