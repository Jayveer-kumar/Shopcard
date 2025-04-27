const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const { userSchema } = require("../joiSchema.js");
const ExpressError = require("../utills/expressError.js");
const wrapAsync=require("../utills/asyncWrap.js");
const passport = require("passport");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const {savedRedirectUrl}=require("../middleware.js");

const validateUser = (req, res, next) => {
    try{
        const { error } = userSchema.validate(req.body.user);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            console.log("Validation Error: ", msg);
            req.flash("error",`${msg}`);
            next( new ExpressError(400,msg));
        }
        next();
    }catch(err){
        next(err);
    }
};


router.get("/register", (req, res) => {
    res.render("users/register.ejs");
});

router.post("/register", validateUser, upload.single("user[image]"), async (req, res, next) => {
    try {
        let { name, username, email, password } = req.body.user;
        let url=req.file.path;
        let fileName=req.file.fieldname;
        let newUser = new User({ name, email, username });
        newUser.image={url,fileName};
        let registerUser = await User.register(newUser, password);
        req.logIn(registerUser,(err)=>{
            if(err){
               return  next(err);
            }
            req.flash("success","Registration Successfull : Enjoy Shopping: ");
            res.redirect("/shopcard");
        })
    } catch (error) {
        req.flash("errorMessage", error.message);
        res.redirect("/shopcard/authenticate/register");
    }
});

router.post("/login", (req, res, next) => { 
    if (req.body.user) {
        req.body.username = req.body.user.username;
        req.body.password = req.body.user.password;
    } next(); // pass control to the next middleware
    }, savedRedirectUrl,  passport.authenticate("local", {
        failureRedirect: "/shopcard/authenticate/register",
        failureFlash: true
    }), (req, res) => {
        req.flash("successMessage", `Welcome Back ${req.user.name}`);
        let redirectPath=res.locals.redirectUrl||"/shopcard";
        res.redirect(`${redirectPath}`);      
    }
);


router.get("/logout",async(req,res,next)=>{
    req.logOut((err)=>{
        if(err) return next(new ExpressError(400,"Not Logout Please try later : "));
        req.flash("successMessage","Logout Successfully : ");
        res.redirect("/shopcard");
    })
})

module.exports = router;