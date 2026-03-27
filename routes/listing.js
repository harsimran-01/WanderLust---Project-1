const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {storage} = require("../cloudConfig.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//controllers
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const upload = multer({storage});
//router.route -> no need to define the route of the same path again and again

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.createListing));
    

//new route to render to a form
router.get("/new", isLoggedIn, (listingController.newForm));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,  upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//index route
// router.get("/", wrapAsync(listingController.index));



//show route
// router.get("/:id", wrapAsync(listingController.showListing));

//create route to add listings into the post

// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;