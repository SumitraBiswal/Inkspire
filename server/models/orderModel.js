import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   userId:{ type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            bookId:{
                type:String,
                required:true,
            },
            quantity:{type:Number,required:true},
            price:{type:Number,required:true},
            
        }
    ],

    address:{
        fullName:String,
        phone:String,
        house:String,
        city:String,
        state:String,
        pincode:String,
        landmark:String,

    },

    PaymentMethod:{
        type:String,
        enum:["COD","UPI","CARD"],
        required:true
    },

    totalPrice:Number,

    status:{
        type:String,
        enum:["Pending","Placed","Cancelled","Delivered"],
        default:"Pending",
    },

    orderAt:{
        type:Date,
        default:Date.now,
    },
    expectedDeliveryDate:{
        type:Date,
        default:()=>new Date(Date.now()+7*24*60*60*1000),

    },


    
});

export default mongoose.model("Order",orderSchema)