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

// router.get("/",  (req,res)=>{   
//     res.render("users/Profile.ejs",{user:res.locals.currentUser});
// });

let userAddress1 = [
  {
    name:"Jayveer Kumar",
    tag:"Home",
    pincode:243639,
    fullAddress:"Village and Post Risouli , Badaun"
  },
  {
    name:"Jayveer Kumar",
    tag:"Office",
    pincode:243601,
    fullAddress:"Near Royal agency , dataganj chungi"
  }
]

let userAddress0 =[];

// Get User address Route

router.get("/address",async (req,res)=>{
  // return res.json(userAddress1);    
  setTimeout(()=>{
    return res.json(userAddress0);
  },2000)
})

module.exports=router;