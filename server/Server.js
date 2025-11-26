import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import BookRouter from "./routes/bookRouter.js";


const app = express();
const port = process.env.PORT || 3200
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,}));

//API endpoints
app.get("/" , (req,res)=>{
    res.send("API working")
});
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use('/api/wishlist',wishlistRouter);
app.use('/api/books',BookRouter);

app.listen(port, ()=> console.log(`Server Started On PORT:${port}`));