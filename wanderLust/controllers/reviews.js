const express = require('express');
const ExpressError=require("../utils/ExpressError.js")
const dayjs = require('dayjs');
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const passport = require("passport");

module.exports.addReview = async(req,res)=>{
    let {id}=req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:review}})
    req.flash("success","Your review is posted");
    res.redirect(`/listings/${id}`);
}

module.exports.showReviewForm = async(req,res) => {
  let {id} = req.params
  req.flash("showReviewModal",true);
  res.redirect(`/listings/${id}`);
}


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});   
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Your review was deleted");
    res.redirect(`/listings/${id}`);
};

module.exports.showMoreReviews = async(req,res)=>{
    //send the next 4 reviews to client side
    let {id} = req.params;
    let offset = parseInt(req.query.offset) || 0 ;
    let limit = 4; //fixed 4 as of now
    const listing = await Listing.findById(id).populate({
    path: "reviews",
    options: {
      skip: offset,           // skip already shown reviews
      limit: limit,           // show next 4 reviews
      sort: { createdAt: -1 } // newest first
    }
  });
    let reviewsObj = listing.reviews.map(review => ({
        ...review.toObject(),
        relativeDate : dayjs(review.createdAt).fromNow()
    }))
  res.json(reviewsObj);
}
module.exports.confirmRequest = async(req,res)=>{
    let {id,reviewId} = req.params;
    req.flash("showConfirmModal",{title:"REVIEW ",url:`/listings/${id}/reviews/${reviewId}?_method=DELETE`});
    res.redirect(`/listings/${id}`);
}