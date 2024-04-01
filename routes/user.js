const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const passport = require("passport");
const {redirectUrl}=require("../middleware.js");
const userController=require("../controller/user.js");



router.route("/signup")
.get(userController.renderSignUpForm)
.post(userController.signUpUser);

router.route("/login")
.get(userController.renderLoginForm)
.post(redirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), userController.loginUser);

//signUp page login
//router.get("/signup", userController.renderSignUpForm);


//signed IN page 
//router.post("/signup", userController.signUpUser);

//login page get route
//router.get("/login", userController.renderLoginForm)

//post route logged in
//router.post("/login", redirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), userController.loginUser);


//logout page get route
router.get("/logout", userController.logoutUser);

module.exports=router;