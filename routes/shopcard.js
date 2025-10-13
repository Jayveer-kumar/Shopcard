const express=require("express");
const router=express.Router({mergeParams:true});
const Product=require("../models/productSchema.js");
const Review=require("../models/reviewSchema.js");
const wrapAsync=require("../utills/asyncWrap.js");
const ExpressError=require("../utills/expressError.js");
const {reviewSchema}=require("../joiSchema.js");
const {isReviewOwner,isLoggesIn}=require("../middleware.js");
const User=require("../models/user.js");
const mongoose = require("mongoose");

const validateReview=(req,res,next)=>{
  try{
    const {error}=reviewSchema.validate(req.body);
    if(error){
      req.flash("error",error.message);
      return next(new ExpressError(400,error.message));
    }
    next();
  }catch(err){
    next(err);
  }
}

// Product Main Route
router.get("/", wrapAsync(async (req, res) => {
  let allProduct = await Product.find();
  const user=req.user;
  res.render("listings/index.ejs", { allProduct,user }); 
}));

// Explore Page Route
router.get("/explore", (req, res) => {
  res.render("listings/Explore.ejs");
});

// Privacy Policy route
router.get("/privacy-policy",(req,res)=>{
  res.render("listings/privacyPolicy.ejs");
})

//  Search Route 
router.get("/search",async (req,res)=>{
  let SearchQuery=req.query.q;
  let user = req.user;
  if(!SearchQuery) return res.redirect(`/shopcard`);
  let product=await Product.find({category:{$regex:SearchQuery,$options:"i"}}).limit(4);
  // Agar JSON response chahiye hoga toh JSON send karenge
  if(req.query.json==="true"){
    return res.json(product);
  }
  // nhi to ejs search page render karenge 
  return res.render("listings/search.ejs",{product , user});  
});

router.get("/liked-product",isLoggesIn,wrapAsync(async(req,res)=>{
  const userId=req.user._id;
  const user= await User.findById(userId).populate("likedProduct");
  if(!user) return  next(new ExpressError(400,"User Not Found"));
  setTimeout(()=>{
    return res.json(user.likedProduct);
  },500)  
}));

//  NEW ROUTE - Get single product details (for dynamic cart add)
router.get("/product/:id", wrapAsync(async(req, res, next) => {
  const { id } = req.params;
  
  // Validate product ID
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({ error: "Invalid Product ID" });
  }
  
  // Find product
  const product = await Product.findById(id);
  
  if(!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  // Return product data as JSON
  return res.json(product);
}));

router.get("/watchlist",isLoggesIn, wrapAsync(async (req,res)=>{
  const userId=req.user._id;
  const user= await User.findById(userId).populate('likedProduct');
  if(!user) return  next(new ExpressError(400,"User Not Found"));
  let userLikedProduct=user.likedProduct;
  return  res.render("listings/watchlist.ejs",{userLikedProduct,user:res.locals.currentUser});
}))

// Product Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  if (id.length > 24 || id.length < 24 || !id) {
    throw new ExpressError(400, "Requested Product is not Found"); 
  }
  else {
    let product = await Product.findById(id).populate({path:"ratings.reviews",populate:{path:"userId"}});
    const user=req.user;
    let categoryProduct = await Product.find({ category: product.category });
    res.render("listings/watchProduct.ejs", { product, categoryProduct,user });
  }
})); 

// Product Add Like Route 
router.post("/:id/like",isLoggesIn,wrapAsync(async (req, res, next) => {
    try {
      let { id } = req.params; // Product id

      // Validate Product id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Product id.");
      }

      // Check if product exists
      let product = await Product.findById(id);
      if (!product) throw new ExpressError(400, "Requested Product not Found!");

      let user = await User.findById(req.user._id);

      // Check if product is already liked by user
      if (user.likedProduct.some((productId) => productId.toString() === id)) {
        return res.json({ message: "Product is already added to your cart!" });
      }

      // Add product to user's likedProduct array
      user.likedProduct.push(id);
      await user.save();
      return res.json({ message: "Product added to your cart." });
    } catch (err) {
      console.error("Product add like route error:", err);
      return res.status(500).json({ error: err.message || "Server error" });
    }
  })
);

// Product like delete Route
router.delete("/:id/like", isLoggesIn, wrapAsync(async (req, res, next) => {
  try {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(400, "Invalid Product id.");
    }

    let product = await Product.findById(id);
    if (!product) {
      throw new ExpressError(400, "Requested Product not Found!");
    }

    // Atomic Update

    await User.findByIdAndUpdate(req.user._id,{$pull:{likedProduct:id}});

    return res.json({ message: "Product removed from your liked list." });
  } catch (err) {
    console.error("Delete route error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}));



router.get("/:id/checkout", isLoggesIn,  wrapAsync(async(req,res)=>{
 let {id}=req.params;
 if (id.length > 24 || id.length < 24 || !id) {
  throw new ExpressError(400, "Requested Product is not Found");
}else{
  let buyProduct=await Product.findById(id);
  if(!buyProduct){
    throw new ExpressError(400,"Requested Product not Found!");
  }else{
    res.render("listings/buy.ejs",{buyProduct});
  }
}
}))

// Review Routes
router.post("/:id/review", isLoggesIn,wrapAsync(async (req, res, next) =>{
  try {
    let { id } = req.params;
    if (!id) return next(new ExpressError(400, "Invalid Product Id"));
    let product = await Product.findById(id);
    if (!product) return next(new ExpressError(404, "Product not found"));
    let {reviews}=req.body;
    if(!reviews) return next(new ExpressError(400,"Rating , Comment is Required"));
    let newReview=new Review({
      userId:req.user.id,
      productId:id,
      rating:reviews.rating,
      comment:reviews.Comment,
    });
    await newReview.save();
    product.ratings.reviews.push(newReview); 
    await product.save();
    req.flash("successMessage","Review Succssfully Addedd : ");
    res.redirect(`/shopcard/${id}`);
  } catch (err) {
    next(err);
  }
}));
// Update Review 
router.put("/:id/review/:reviewId", isLoggesIn,isReviewOwner,wrapAsync( async (req,res)=>{   
  let {id,reviewId}=req.params;
  let updatedReview=req.body.comment;
  if(!updatedReview){
    req.flash("errorMessage","Please Submit valid review : ");
    return res.redirect(`/shopcard/${id}`);
  }
  let review=await Review.findByIdAndUpdate(reviewId,{comment:updatedReview},{new:true});
  if(!review){
    req.flash("errorMessage","Review Not Found : "); 
    return res.redirect(`/shopcard/${id}`);
  }
  req.flash("successMessage","Review Updated Successfully : ");
  res.redirect(`/shopcard/${id}`); 
}));

router.delete("/:id/review/:reviewId",isLoggesIn,isReviewOwner,wrapAsync( async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findByIdAndDelete(reviewId);
  if(!review) return next(new ExpressError(400,"Requested Review Not Found :"));
  req.flash("successMessage","Review Delete Successfully : ");
  res.redirect(`/shopcard/${id}`);
}));

module.exports=router;