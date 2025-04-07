const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image:{
        url:String,
        fileName:String
    }
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