const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchemaJoi}=require("../schema.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");
const { isLoggedIn, validateReview }=require("../middleware.js");
const reviewController=require("../controller/review.js");






//review post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createPostRoute));


//review delete route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteRoute));

module.exports=router;