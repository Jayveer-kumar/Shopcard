const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
// const {isLoggedIn}=require("../middleware.js");

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("errorMessage","Please Login first : ");
    res.redirect("/shopcard/authenticate/register");
}

// Render User Profile Page
router.get("/", isLoggedIn, (req,res)=>{   
    res.render("users/Profile.ejs",{user:res.locals.currentUser});
});

module.exports=router;