const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings.js")
const {validateListing }= require("../middleware/listings.js");
const { isLoggedIn  } = require('../middleware/users.js');

router  
    .route("/")
        //INDEX ROUTE
        .get(wrapAsync(listingController.index))
        //CREATE ROUTE
        .post(validateListing,wrapAsync(listingController.addListing))

//NEW ROUTE
router.get("/new/guide",listingController.showGuide);
router.get("/new",isLoggedIn,listingController.renderNewForm);

//SHOW ROUTE
router.get("/:id",wrapAsync(listingController.showListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

//CONFIRM REQUEST ROUTE
router.get("/:id/confirmRequest",isLoggedIn,wrapAsync(listingController.confirmRequest));

router
    .route("/:id")
        //UPDATE ROUTE
        .put(validateListing,wrapAsync(listingController.updateListing))
        //DELETE ROUTE
        .delete(wrapAsync(listingController.destroyListing))

module.exports = router;