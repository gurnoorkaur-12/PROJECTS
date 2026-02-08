const express = require("express");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = async(req,res,next)=>{
    res.render("./users/signupForm.ejs");
}
module.exports.signup = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const newUser  = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash("success",`Welcome to Wanderlust ${username} !`);
            return res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        if(await User.findOne({email:req.body.email})){
            req.flash("showLoginModal",true);
            res.redirect("/listings");
        }
    }
}

module.exports.renderLoginForm = async(req,res,next)=>{
    res.render("./users/loginForm.ejs");
}

module.exports.login = async(req,res,next)=>{
        req.flash("success",'Welcome back to Wanderlust');
        res.redirect("/listings");
};

module.exports.redirectLogout = async(req,res,next) =>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
}
module.exports.logout = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    res.redirect("/listings");

}
