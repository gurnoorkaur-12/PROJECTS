const express = require("express");
const passport = require("passport");  
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.isUsername = async(req,res,next)=>{
    const {identifier,password} = req.body;
    if(identifier.includes('@')){
        //login via email
        const user =await User.findOne({email:identifier});
        if(!user){
            req.flash("error","Email or username does not exists");
            return res.redirect("/signup");
        }
        req.body.username = user.username;
    }else{
        //login via username
        req.body.username = identifier;
    }
        next();

}
module.exports.isAuthenticated = passport.authenticate('local',{
        failureRedirect:"/signup",
        failureFlash:true
});
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next) =>{
    if ( req.session.redirectUrl ) {
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}
module.exports.isOwner = async(req,res,next) => {
    const {id} = req.params;
    const listing = await Listing.findById({_id:id});
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error","You don't have permission to continue");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async(req,res,next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById({_id:reviewId});
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}