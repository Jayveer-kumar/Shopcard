const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
        .min(6)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
        .message("Password must contain at least one uppercase letter, one lowercase letter, and one digit")
        .required()
});

const reviewSchema=Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    Comment:Joi.string().required(),
})

const addressValidationSchema = Joi.object({
    fullName : Joi.string().min(3).max(50).required(),
    gender : Joi.string().valid("Male","Femail","Other").default("Other"),
    mobileNumber : Joi.string().pattern(/^[6-9]\d{9}$/).message("Enter a valid 10-digit indian mobile Number").required(),
    alternatePhone : Joi.string().pattern(/^[6-9]\d{9}$/).message("Enter a valid 10-dogit alternate mobile Number").optional(),
    pincode : Joi.string().pattern(/^\d{6}$/).message("Enter a valid 6 digit pincode"),
    locality : Joi.string().min(3).required(),
    addressLine : Joi.string().min(3).required(),
    city : Joi.string().min(2).required(),
    state : Joi.string().min(2).required(),
    landmark : Joi.string().allow("").optional(),
    addressType : Joi.string().valid("Home","Work","Office").required()
})



module.exports = { userSchema , reviewSchema , addressValidationSchema };