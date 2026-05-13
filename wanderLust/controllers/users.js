const express = require("express");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const Review = require("../models/reviews");
const Listing = require("../models/listing");

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
module.exports.showAbout = async(req,res)=>{
    if(req.user){
        res.render("./users/about.ejs");
    }else{
        res.redirect("/signup");
    }
}
module.exports.showTrips = async(req,res)=>{
    if(req.user){
        res.render("./users/trips.ejs");
    }else{
        res.redirect("/signup");
    }
}

module.exports.addIntro = async(req,res)=>{
    if(req.user){
        user  = await User.findOneAndUpdate({username : req.user.username},{intro:req.body.intro});
        res.redirect("/myaccount/about");
    }else{
        res.redirect("/signup");
    }   
}
module.exports.updateIntro = async(req,res) => {
    if(req.user){
        user = await User.findOneAndUpdate({username:req.user.username},{$unset :{intro:1}},{ new: true });
        res.redirect("/myaccount/about");
    }else{
        res.redirect("/signup");
    }
}
module.exports.showMyReviews = async(req,res)=>{
    let {id} = req.params;
    if( id == "reviewsByYou" ){
        let reviews = await Review.find({author : req.user._id});
        
        let reviewIds = reviews.map(r => r._id);

        let listings =await Listing.find({reviews:{$in:reviewIds}})
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            });
            
        res.render("./users/myReviews.ejs",{listings,name:"Reviews by you"});
    }else{
        let listings =await Listing.find({owner:req.user._id}).populate({
            path: "reviews",
            populate: {
                path: "author"
            },
            options:{ sort: {createdAt: -1} }
        }); 
        
        res.render("./users/myReviews.ejs" , {listings,name:"Reviews about you"});
    }

}