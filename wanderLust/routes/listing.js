const express = require('express');
const router = express.Router();
const Listing=require("../models/listing.js")
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const dayjs = require('dayjs');
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

//Validation for Server Side ( using Joi)
const { listingSchema }=require("../schema.js");

const validateListing = (req,res,next)=>{
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


//INDEX ROUTE
router.get("/",wrapAsync(async (req,res)=>{
    let listings=await Listing.find();
    res.render("./listings/index.ejs",{listings});
}));

//NEW ROUTE
router.get("/new/guide",(req,res)=>{
    res.render("./listings/guide.ejs");
});
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
})


//SHOW ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let {reviews} = await listing.populate({
        path:"reviews",
        options:{
            sort: { createdAt: -1 } 
        }
    }) ;
    let reviewsObj = reviews.map(review => ({
        ...review.toObject(),
        relativeDate : dayjs(review.createdAt).fromNow()
    }))
    res.render("./listings/show.ejs",{listing,reviews:reviewsObj}); 
}));


//CREATE ROUTE
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();   
    res.redirect("/listings");
}))


//EDIT ROUTE
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))


//UPDATE ROUTE
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate({_id:id},{...req.body.listing},{new:false});
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing"); 
    }
    res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;