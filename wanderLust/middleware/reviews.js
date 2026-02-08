const express = require("express");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");

//Validation for Server Side ( using Joi)
const { reviewSchema }=require("../schema.js");

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((ele)=>
        ele.message
            ).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
}

module.exports = validateReview ; 