const mongoose = require("mongoose");
const Product = require("./productSchema");

const reviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
});

reviewSchema.post("findOneAndDelete",async(review)=>{
   if(!review) return;
   let product=await Product.findById(review.productId);
   if(!product) return;
   await Product.updateOne({_id:review.productId},{$pull:{"ratings.reviews":review.id}});
})
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
