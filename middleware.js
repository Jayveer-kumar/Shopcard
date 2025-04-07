module.exports.isLoggesIn =(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login first : ");
    res.redirect("shopcard/authenticate/register");
}