const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// 2nd step for server side validation of reviews


//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

//review route
// 3rd step using in the route/api call
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

module.exports = router;