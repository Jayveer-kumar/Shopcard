const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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