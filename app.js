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

let productArray=[
  {
    Brand:"Boult",
    title:"Boult Y1 Pro with Zen Quad Mic ENC, 60Hrs Battery, Fast Charging, Knurled Design, 5.3v Bluetooth  (Powder Blue, True Wireless)",
    description:"Tune in and zone out with Boult Y1 Pro earbuds. Immerse yourself in sound with a whooping 60 hours of playtime, allowing you to escape into your world. Experience Lightning Boult type C fast charging, giving you a remarkable 120 minutes of playtime from just 10 minutes of charging. Communicate clearly with ZENquad mic AI-ENC, enhancing your calls and ensuring your voice is heard",
    prize:850,
    category:"earphones",
    stock:15,
    image:[
      "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/s/7/f/-original-imahf4qppx6fkxtw.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/q/f/s/-original-imahygcjrwkzwc3b.jpeg?q=70&crop=false"
    ],
    color:[],
    sizes:[],
    ratings:{
      average:4.5,
      reviews:[],
    }

  },
  {
   Brand:"Dell",
   title:"DELL Inspiron 7440 2-in-1 Intel Core i5 13th Gen 1334U - (16 GB/512 GB SSD/Windows 11 Home) Inspiron 14 2-in-1 2 in 1 Laptop  (14 Inch, Ice Blue, 1.71 Kg, With MS Office)",
   description:"You can boost your productivity and entertainment with the DELL Inspiron 7440 35.56 cm (14) Laptop. Featuring a flexible two-in-one design with multiple modes and powerful Intel core processors, this laptop enhances both portability and versatility. With Dolby Atmos integration, this laptop delivers exceptional, immersive sound, letting you enjoy content the way the creators intended. Thanks to its up to 360-degree hinge, this laptop allows you to seamlessly switch between tablet, tent, stand, or laptop modes",
   prize:85900,
   category:"laptop",
   stock:4,
   image:[
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/b/s/k/-original-imah9gv64nh4fgca.jpeg",
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/v/u/p/-original-imah99uqjzzphzn3.jpeg",
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/2/d/y/-original-imah9c8yzxasj9st.jpeg",
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/3/j/l/inspiron-7440-2-in-1-2-in-1-laptop-dell-original-imah8hhryaupmuw2.jpeg",
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/e/m/c/-original-imah8xqg5mwsjfpq.jpeg",
    "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/t/c/v/-original-imah8xqgbypzzhg6.jpeg"
   ],
   color:[],
   sizes:[],
   ratings:{
     average:4.1,
     reviews:[],
   }
  }
]

let insertData=async(data)=>{
  try{
    let result=await Product.insertMany(data);
    if(!result){
          console.log("Some Error During Saving Data : ");
          return;
    }
    console.log("Data Added Successfully : ");
    console.log(result);
  }catch(err){
    console.error(err);
  }
}


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





// const product=[
//   {
//     Brand:"Wrogn",
//     title:"Men Solid Lather Jackets",
//     description:"Stylish and durable leather biker jacket with a slim fit design. Perfect for winter fashion.",
//     prize:2999,
//     category:"fashion",
//     stock:10,
//     image:[
//       "https://rukminim2.flixcart.com/image/832/832/jvtujrk0/jacket/q/d/q/xxl-6832211-wrogn-original-imafgmsmywzk6uuy.jpeg?q=70&crop=false",
//       "https://rukminim2.flixcart.com/image/832/832/jvtujrk0/jacket/q/d/q/m-6832211-wrogn-original-imafgmsm54e8f7wg.jpeg?q=70&crop=false",
//       "https://rukminim2.flixcart.com/image/832/832/jvtujrk0/jacket/q/d/q/xl-6832211-wrogn-original-imafgmsmyzyzhwdy.jpeg?q=70&crop=false"
//     ],
//     color:[],
//     sizes:["M","XML"],
//     rating:{
//       average:4.6, reviews:[],
//     }
//   } 
// ];
  
// const insertData=async (data)=>{
//   try{
//    let result=await Product.insertMany(data);
//    if(!result){
//     console.log("Some Error During Saving Data : ");
//     return;
//    }else{
//     console.log("Data SuccessFully Saved to the database  ");
//    }
//   }catch(err){
//     console.error(err.message);
//   }
// }




















// app.use("/apidata",(req,res,next)=>{
//   let {token}=req.query;
//   if(token==="okData"){
//     return next();
//   }
//   throw new ExpressError(401,"Token is missing : ");
// })


// app.get("/apidata",(req,res)=>{
//   res.send("Data Recieved : ");
//   console.log("Data Client Side ko send kar diya gya hai  : ");
// });

// app.get("/testAsync",async (req,res,next)=>{
//   setTimeout(()=>{
//     next(new ExpressError(400,"Wrap Function Executed : "));
//   },1000);
// })