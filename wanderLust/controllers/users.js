const express = require("express");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = async(req,res,next)=>{
    res.render("./users/signupForm.ejs");
}
module.exports.signup = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl ||req.body.redirectUrl || "/listings"; 
    try{
        const {username,email,password} = req.body;
        const newUser  = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash("success",`Welcome to Wanderlust ${username} !`);
            return res.redirect(redirectUrl);
        });
    }catch(err){
        req.flash("error",err.message);
        if(await User.findOne({email:req.body.email})){
            req.flash("showLoginModal",true);
            res.redirect(redirectUrl);
        }
    }
}

module.exports.renderLoginForm = async(req,res,next)=>{
    res.render("./users/loginForm.ejs");
}

module.exports.login = async(req,res,next)=>{
        req.flash("success",'Welcome back to Wanderlust');
        res.redirect(res.locals.redirectUrl || req.body.redirectUrl || "/listings");
        delete res.locals.redirectUrl;
};

module.exports.logout = async(req,res,next)=>{
    let redirectUrl = res.locals.redirectUrl || req.body.redirectUrl ||"/listings";
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    res.redirect(redirectUrl);
}
