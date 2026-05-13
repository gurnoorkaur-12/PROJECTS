const express = require('express');
const router = express.Router({ mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");
const {  isUsername, isAuthenticated ,saveRedirectUrl } = require('../middleware/users.js');

router
    .route("/signup")
        .get(wrapAsync(userController.renderSignupForm))
        .post(wrapAsync(userController.signup));

router
    .route("/login")
        .get(wrapAsync(userController.renderLoginForm))
        .post(saveRedirectUrl,isUsername ,isAuthenticated,wrapAsync(userController.login));

router
    .route("/logout")
        .post(wrapAsync(userController.logout));

router
    .route("/myaccount/about")
        .get(wrapAsync(userController.showAbout))
        .post(wrapAsync(userController.addIntro))
        .put(wrapAsync(userController.updateIntro));
router
    .route("/myaccount/trips")
        .get(wrapAsync(userController.showTrips));

router
    .route("/myaccount/reviews/:id")
        .get(wrapAsync(userController.showMyReviews));
module.exports = router;
