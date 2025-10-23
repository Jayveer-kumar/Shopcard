const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const addressSchema = require("./addressSchema");
const Order = require("../models/OrderSchema.js");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        url: String,
        fileName: String
    },
    likedProduct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    addresses:{
        type:[addressSchema],
        default:[],
    },
    orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
    default: []
    },
    // Password reset token and its expiry time
    passwordResetToken: String,
    passwordResetExpires: Date
});


userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
    usernameQueryFields: ['email']  // for email logins
});

const User = mongoose.model('User', userSchema);
module.exports = User;