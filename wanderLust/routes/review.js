const express = require('express');
const router = express.Router({ mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const validateReview = require("../middleware/reviews.js");
const reviewController = require("../controllers/reviews.js");
const { isLoggedIn } = require('../middleware/users.js');

//Review Route
//Post REVIEW route
router  
    .route("/")
        .get(isLoggedIn,wrapAsync(reviewController.showReviewForm))
        .post(validateReview,wrapAsync(reviewController.addReview));

// DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewController.destroyReview));

//SHOW MORE REVIEWS
router.get("/loadreviews",wrapAsync(reviewController.showMoreReviews));


//CONFIRM REQUEST ROUTE
router.get("/:reviewId/confirmRequest",isLoggedIn,wrapAsync(reviewController.confirmRequest));

module.exports = router;