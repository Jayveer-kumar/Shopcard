const Review = require("./models/reviewSchema");
const asyncWrap = require("./utills/asyncWrap");

const { addressValidationSchema } = require("./joiSchema");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        // Now check if request is AJAX (Fetch) 
        if(req.get("X-Requested-With")==="XMLHttpRequest"){
            // this is fetch request , Now we send  JSON response  for user like and dislike  handle smoothly 
            req.session.redirectUrl=req.referer;        
            return res.status(401).json({ message: "You must be logged in.", redirectUrl: "/shopcard/authenticate/register?action=login" });
        }else{
            // normal browser request hai, page render karna
            req.flash("errorMessage","Please Login to continue shoping : ");
            return res.redirect("/shopcard/authenticate/register?action=login");    
            // return res.status(401).redirect("/shopcard/authenticate/register?action=login");
            // return res.status(401).message("Only Authorized User can access this page : ").redirect("/shopcard/authenticate/register?action=login");
        }   
    }
    return next();    
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
    }
    return next();
}

module.exports.isReviewOwner=  asyncWrap(async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.userId.equals(req.user._id)){
        req.flash("errorMessage","Sorry! You are not the owner of this review!");
        return res.redirect(`/shopcard/${id}`);
    }
    return next();
})

module.exports.validateAddress = function(req,res,next){
  const { error } = addressValidationSchema.validate(req.body,{ abortEarly : false});
  if(error){
    console.log("Some important Address Field are missing in new address : see below  ");
    const errorMessage = error.details.map((err) => err.message);
    console.log(errorMessage);
    req.flash("errorMessage","Some Required Field are missing in new address");
    return res.status(400).json({success:false, errors: errorMessage})
  }
  next();
}