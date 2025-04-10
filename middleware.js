const Review = require("./models/reviewSchema");
const asyncWrap = require("./utills/asyncWrap");

module.exports.isLoggesIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("errorMessage","Please Login to continue shoping : ");
        return res.redirect("/shopcard/authenticate/register");        
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