const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const Order = require("../models/OrderSchema.js");
const addressSchema = require("../models/addressSchema.js"); 



const { isLoggedIn , validateAddress } = require("../middleware.js");

// Render User Profile Page
router.get("/", isLoggedIn, (req,res)=>{   
    res.render("users/Profile.ejs",{user:res.locals.currentUser});
});


// Get User Information Route

router.get("/profile-information",isLoggedIn,async(req,res)=>{
  const user = await User.findById(req.user.id).select("name email addresses.gender addresses.mobileNumber");
  const firstAddress = user.addresses[0] || {};
  const senetizedUser = {
    name : user.name,
    email : user.email,
    gender : firstAddress.gender || "Not specified",
    phone : firstAddress.mobileNumber || "Not specified"
  }
  setTimeout(()=>{
    return res.json(senetizedUser);
  },500);
});

// Get User Order's List Route

router.get("/myorders", isLoggedIn, async(req,res)=>{
  let userOrders = await Order.find({ user: req.user._id });  
  setTimeout(()=>{
    return res.json(userOrders);
  },500);
})

// Get user Address List Route

router.get("/address", isLoggedIn, async (req,res)=>{
  let user = await User.findById(req.user._id);
  let addresses = user.addresses;
  setTimeout(()=>{
    // return res.json(addresses);
    return res.status(200).json(addresses);
  },500)
})


// Add New Address Route
router.post("/address/new",isLoggedIn , validateAddress , async(req,res)=>{
  let user = await User.findById(req.user._id);
  let newAddress = req.body;
  user.addresses.push(newAddress);
  await user.save();
  return res.json({success:true, message:"New address  saved successfully.",totalAddress : user.addresses})
})



// Get User Pancard Information Route 

router.get("/pancard-information", isLoggedIn, async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your Pancard Information"});
  },200)
})

// Gift Card Route

router.get("/gift-card", isLoggedIn, async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your Shopcard Gift : "});
  },200);
})

// Get Saved UPI Route

router.get("/saved-upi", isLoggedIn , async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your Saved UPI List : "});
  } , 200);
})

// Get user Coupon Route

router.get("/coupon", isLoggedIn, async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your available Coupon's List : "});
  },200);
})

// Get all Review's of user 

router.get("/review-rating", isLoggedIn, async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your all the Review List : "});
  },200);
})

// Get all the notification of user

router.get("/notification", isLoggedIn, async(req,res)=>{
  setTimeout(()=>{
    return res.json({message:"Here is your all the notification's : "});
  },200);
});


// Get user Watchlist Product

router.get("/watchlist", isLoggedIn, async(req,res)=>{
  const user= await User.findById(req.user._id).populate("likedProduct");
  if(!user) return  next(new ExpressError(400,"User Not Found"));
  setTimeout(()=>{
    return res.json(user.likedProduct);
  },200) 
})


// Update Address Route

router.put("/address/:id",isLoggedIn , validateAddress ,async(req,res)=>{
  let {id} = req.params;
  let updatedAddress = req.body;
  let user = await User.findById(req.user._id);

  // find the index of the address to update
  let idx = user.addresses.findIndex(addr => addr._id.toString() === id);
  if(idx === -1){
    return res.status(404).json({ success: false, message: "Address not found" });
  }

  // Update the specific address by using index value => idx
  user.addresses[idx] = {
    ...user.addresses[idx]._doc,
    ...updatedAddress
  }

  await user.save(); 
  return res.json({ success: true, message: "Address updated successfully", addresses: user.addresses });

})

// Delete Address Route 

router.delete("/address/:id",isLoggedIn,async(req,res)=>{
  let {id} = req.params;

  let user  = await User.findByIdAndUpdate(
    req.user._id,
    { $pull : { addresses : {_id : id } }  },
    { new : true }
  )
  // Equivalent to `parent.children.pull(_id)`
  // parent.children.id(_id).deleteOne();
  if(!user){
    return res.status(401).json({success : false , message : "Address not deletd or , User Not Found"})
  }
  
  return res.json({success:true , message : "Address Deleted Successfully" , totalAddress : user.addresses});
})


module.exports=router;