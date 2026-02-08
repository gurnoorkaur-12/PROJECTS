const express = require('express');
const ExpressError=require("../utils/ExpressError.js");

//Validation for Server Side ( using Joi)
const { listingSchema }=require("../schema.js");

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
    let errorMsg=error.details.map((ele)=>
        ele.message
    ).join(",");
        throw new ExpressError(400,errorMsg)
    }else{
        next();
    } 
}
