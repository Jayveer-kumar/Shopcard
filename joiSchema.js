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

module.exports = { userSchema , reviewSchema };