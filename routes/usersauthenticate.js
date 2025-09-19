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

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

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
        console.log(req.body.username, req.body.password);
    } 
    next();
}, savedRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            req.flash("errorMessage", "Invalid username or password");
            return res.redirect("/shopcard/authenticate/register?action=login");
        }
        // Login successful
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("successMessage", `Welcome Back ${user.name}`);
            let redirectPath = res.locals.redirectUrl || "/shopcard";
            return res.redirect(`${redirectPath}`);
        });
    })(req, res, next);
});



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get("/forgetPassword",(req,res)=>{
    res.render("users/forgetPassword.ejs");
})


router.post("/forgetPassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Find User By Email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("errorMessage", "Sorry, no account with that email address exists.");
      return res.redirect("/shopcard/authenticate/forgetPassword");
    }

    // First clear old Reset Token and expires time
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();


    // Create Reset URL
    const resetUrl = `${req.protocol}://${req.get("host")}/shopcard/authenticate/reset-password/${resetToken}`;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER || "Jayveerk394@gmail.com",
      to: "jasanjatav@gmail.com", // Change to user.email in production
      subject: `Password Reset Request - ${timestamp}`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${user.username || "User"},</p>
        <p>You have requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p><strong>This link is valid for only 1 hour.</strong></p>
        <p>If you did not request this, please ignore this email. 
        </br>
        If you have any questions, feel free to contact our support team.</p>
        <p>Thank you,</p>
        <p>Your ShopCard Team</p>
        <p><em>Timestamp: ${timestamp}</em></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (info && info.messageId) {
      req.flash("successMessage", "An email has been sent to your email address with further instructions.");
    } else {
      req.flash("errorMessage", "Error while sending mail. Please try again later.");
    }

    return res.redirect("/shopcard/authenticate/forgetPassword");

  } catch (error) {
    console.error("Forget password error:", error);
    req.flash("errorMessage", "Something went wrong. Please try again.");
    return res.redirect("/shopcard/authenticate/forgetPassword");
  }
});





router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        // Check if token is valid and not expired
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            req.flash('errorMessage', 'Password reset token is invalid or has expired.');
            return res.redirect('/shopcard/authenticate/forgetPassword'); // Fixed path
        }

        res.render('users/ResetPassword.ejs', { 
            token,
            user: user,
            errorMessage: req.flash('errorMessage'),
            successMessage: req.flash('successMessage')
        });
        
    } catch (error) {
        console.error('Reset password GET error:', error);
        req.flash('errorMessage', 'Something went wrong.');
        res.redirect('/shopcard/authenticate/forgetPassword'); // Fixed path
    }
});


router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        
        // Validate password length
        if (password.length < 6) {
            req.flash('errorMessage', 'Password must be at least 6 characters long.');
            return res.redirect(`/shopcard/authenticate/reset-password/${token}`);
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            req.flash('errorMessage', 'Passwords do not match.');
            return res.redirect(`/shopcard/authenticate/reset-password/${token}`);
        }
        
        // Find user with token
        const user = await User.findOne({
            passwordResetToken: token, 
            passwordResetExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            req.flash('errorMessage', 'Password reset token is invalid or has expired.');
            return res.redirect('/shopcard/authenticate/forgetPassword');
        }
        
        // Passport-local-mongoose  proper method
        await user.setPassword(password);
        
        // Clear reset tokens
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        // Send confirmation email
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER || 'Jayveerk394@gmail.com',
            to:  "jasanjatav@gmail.com", // Change to user.email in production
            subject: 'Password Successfully Reset',
            html: `
                <h2>Password Reset Successful</h2>
                <p>Hi ${user.username || user.name || 'User'},</p>
                <p>Your password has been successfully reset.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <p>You can now login with your new password.</p>
                <p>Thank you,</p>
                <p>Your ShopCard Team</p>
            `
        };
        
        try {
            await transporter.sendMail(confirmationMailOptions);
            console.log('Confirmation email sent successfully');
        } catch (emailError) {
            console.error('Confirmation email error:', emailError);
        }
        
        req.flash('successMessage', 'Password successfully reset! You can now login with your new password.');
        res.redirect('/shopcard/authenticate/register?action=Login');
        
    } catch (error) {
        console.error('Password reset POST error:', error);
        req.flash('errorMessage', 'Something went wrong. Please try again.');
        res.redirect(`/shopcard/authenticate/reset-password/${req.params.token}`);
    }
});





router.get("/logout",async(req,res,next)=>{
    req.logOut((err)=>{
        if(err) return next(new ExpressError(400,"Not Logout Please try later : "));
        req.flash("successMessage","Logout Successfully : ");
        res.redirect("/shopcard");
    })
})

module.exports = router;