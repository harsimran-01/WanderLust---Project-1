//route for the signup page of users
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");


// const controllers

const userController = require("../controllers/users");

// router.route

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup))

router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local",
        { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));


//get to render the form for signup
// router.get("/signup", userController.renderSignup);

//post route to signup 
// router.post("/signup", wrapAsync(userController.signup));


//get request to render login page
// router.get("/login", userController.renderLogin);

// post request to do the login
//passport.authenticate() -> passport middleware to authenticate whether the user exists in database or not.
// router.post("/login", saveRedirectUrl,passport.authenticate("local",
// { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));


//logout route
router.get("/logout", userController.logout);

module.exports = router;