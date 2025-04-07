const { required } = require("joi");
const mongoose=require("mongoose");
const User=require("./user");
const productSchema=new mongoose.Schema({
    Brand:{
      type:String,
      required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    prize:{
        type:Number,
        required:true,
    },
    category:{
      type:String,
      enum:[
        "electronics",
        "fashion",
        "home",
        "sports",
        "mobiles",
        "Bags",
        "ferniture",
        "laptop",
        "earphones",
      ],
      required:true,
    },
    stock:{
        type:Number,
        required:true,
        min:0,
    },
    image:[String],
    color:[
        {
            colorName:String,
            image:String,
        }
    ],
    sizes:[String],
    ratings:{
        average:{type:Number,default:0},
        reviews:[ 
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Review",
            }
        ]
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Product=mongoose.model("Product",productSchema);
module.exports=Product;