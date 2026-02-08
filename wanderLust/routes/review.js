const express = require('express');
const router = express.Router({ mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const validateReview = require("../middleware/reviews.js");
const reviewController = require("../controllers/reviews.js");

//Review Route
//Post REVIEW route
router  
    .route("/")
        .get(wrapAsync(reviewController.showReviewForm))
        .post(validateReview,wrapAsync(reviewController.addReview));

// DELETE REVIEW ROUTE
router.delete("/:reviewId",wrapAsync(reviewController.destroyReview));

//SHOW MORE REVIEWS
router.get("/loadreviews",wrapAsync(reviewController.showMoreReviews));

module.exports = router;