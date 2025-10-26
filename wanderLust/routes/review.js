const express = require('express');
const router = express.Router({ mergeParams:true });
const dayjs = require('dayjs');
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js")


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


//Review Route
//Post REVIEW route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const review = new Review(req.body.review);
    await review.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:review}});
    res.redirect(`/listings/${id}`);
}));

// DELETE REVIEW ROUTE
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});   
     await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}
));
//SHOW MORE REVIEWS
router.get("/loadreviews",wrapAsync(async(req,res)=>{
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
}));

module.exports = router;