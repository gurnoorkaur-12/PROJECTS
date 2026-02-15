const express = require("express");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const dayjs = require('dayjs');
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);


module.exports.index = async (req,res)=>{
    let listings=await Listing.find();
    res.render("./listings/index.ejs",{listings});}

module.exports.addListing = async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();   
    req.flash('success',"New Listing created");
    res.redirect("/listings");}

module.exports.showGuide = (req,res)=>{
    res.render("./listings/guide.ejs");
}
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}
module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    
    let listing = await Listing.findById(id)
    //nested populate
    .populate({ path:"reviews" ,populate : ( { path : "author" }) ,  options:{ sort: {createdAt: -1} }})
    .populate({path:"owner"});

    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    let reviewsObj = listing.reviews.map(review => ({
        ...review.toObject(),
        relativeDate : dayjs(review.createdAt).fromNow()
    }))
    res.render("./listings/show.ejs",{listing,reviews:reviewsObj}); 
}  


module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate({_id:id},{...req.body.listing},{new:false});
    req.flash("success","Listing was updated successfully");
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing"); 
    }
    res.redirect(`/listings/${id}`);}

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was deleted");
    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    res.redirect(`/listings`);}

module.exports.confirmRequest = async(req,res)=>{
    let {id} = req.params;
    req.flash("showConfirmModal",{title:"LISTING ",url:`/listings/${id}?_method=DELETE`});
    res.redirect(`/listings/${id}`);
}