import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    bookId:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:1,
        min:1,
    },
       price:{
        type:Number,
        default:0,
    },
 
    addedAt:{
        type:Date,
        default:Date.now,
    },
});

const cartSchema= new mongoose.Schema(
{
        userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    
    items:[cartItemSchema],
    totalQuantity:{type:Number,default:0},
    totalPrice:{type:Number,default:0},

},
{timestamps:true}
);


cartSchema.pre("save",function(next){
    this.totalQuantity=this.items.reduce((sum,item)=>sum + item.quantity,0);
    this.totalPrice=this.items.reduce((sum,item)=>sum+item.quantity*item.price,0);
    next()
});
export default mongoose.model("Cart",cartSchema);