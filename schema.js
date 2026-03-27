//schema for the server side validator

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().allow(""),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string().allow(""),
            url: Joi.string().uri().allow("")
        }).optional()
    }).required()
})

// server side validation step 1 -> for reviews
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})

// module.exports = listingSchema;