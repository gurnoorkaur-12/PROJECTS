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
        .get(userController.renderLoginForm)
        .post(saveRedirectUrl,isUsername ,isAuthenticated,wrapAsync(userController.login));

router
    .post("/logout",wrapAsync(userController.logout));

module.exports = router;
