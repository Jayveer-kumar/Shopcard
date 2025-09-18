const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image:{
        url:String,
        fileName:String
    },
    likedProduct:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    // Password reset token and its expiry time
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.plugin(passportLocalMongoose); 

const User = mongoose.model("User", userSchema);
module.exports = User;


// ,
//     address:[
//         {
//             type:{type:String,
//                 enum:["home","work","other"],
//                 default:"home",
//             },
//             street:String,
//             city:String,
//             state:String,
//             country:String,
//             pinCode:Number
//         }
//     ],
//     phoneNumber:Number,
//     role:{
//         type:String,
//         enum:["admin","user"],
//         default:"user",
//     }