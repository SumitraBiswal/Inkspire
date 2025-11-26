import mongoose from "mongoose";

const bookschema=new mongoose.Schema(
    {    
       id:{ type:String,required:true,unique:true},
        title:{ type:String,required:true,trim:true },
        author:{ type:String,required:true,trim:true },
        description:{ type:String,required:true,trim:true },
        category:{ type:String,required:true },
        categoryId:{ type:String,required:true },
        subcategory:{ type:String,default:""},
        subcategoryId:{ type:String,default:""},
        publishedYear:{ type:String,required:true },
        originalPrice:{ type:Number,required:true },
        discountPrice:{ type:Number,required:true },
        discountPercent:{ type:Number,required:true },
        image:{ type:String,default:"" },
        available:{ type:Boolean,default:true },  
        rating:{ type:Number,default:0}, 
        pages:{ type:Number,required:true}, 
        totalreviews:{ type:Number,default:0 },
        pages:{ type:Number,required:true }, 
        language:{ type:String,required:true },  
        pdfPath:{type:String}  ,
        pdfPrice:{type:Number,default:0}  ,
        hasPdf:{type:Boolean,default:false}
    },
    {timestamps:true}
);
export default mongoose.model("Book",bookschema);