const express = require("express");
const passport = require("passport");  
const User = require("../models/user.js");

module.exports.isUsername = async(req,res,next)=>{
    const {identifier,password} = req.body;
    if(identifier.includes('@')){
        //login via email
        const user =await User.findOne({email:identifier});
        if(!user){
            req.flash("error","Email or username does not exists");
            return res.redirect("/listings");
        }
        req.body.username = user.username;
    }else{
        //login via username
        req.body.username = identifier;
    }
        next();

}
module.exports.isAuthenticated = passport.authenticate('local',{
        failureRedirect:"/login",
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