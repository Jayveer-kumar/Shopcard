if(process.env.NODE_ENV !="Production"){
  require("dotenv").config();
}
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const ejs=require("ejs");
const ejs_mate=require("ejs-mate");
const ExpressError=require("./utills/expressError.js");
const mongoose = require('mongoose');
const User=require("./models/user.js");
const cookie_parser=require("cookie-parser");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const shopcardRouter=require("./routes/shopcard.js");
const usersRouter=require("./routes/usersauthenticate.js");
const usersProfile=require("./routes/user_Profile.js");
const methodOverride=require("method-override");
const { title } = require("process");
const Product = require("./models/productSchema.js");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ShopCard');
}
main().catch(err => console.log(err));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"view"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejs_mate);
app.use(methodOverride('_method'));

app.use(cookie_parser("secretkey"));

mongoose.set("strictPopulate",false);

const option={
  secret:"mysecretkey",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60+1000,
    httpOnly:true
  }
};

app.use(session(option));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use((req,res,next)=>{
  res.locals.successMessage=req.flash("successMessage");
  res.locals.errorMessage=req.flash("errorMessage");
  res.locals.currentUser=req.user;
  next();
});



app.use("/shopcard/authenticate",usersRouter);
app.use("/shopcard/user-profile",usersProfile); 
app.use("/shopcard",shopcardRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
  let {status=500,message="Some Error Occured"}=err;
  res.status(status).render("listings/error.ejs",{message});
})

app.listen(port,()=>{
  console.log(`Server is Running at : ${port} port `);
}) 

