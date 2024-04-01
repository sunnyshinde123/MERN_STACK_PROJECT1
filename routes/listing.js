const express=require("express");
const router=express.Router();
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchemaJoi}=require("../schema.js");
const Listing=require("../model/listing.js");
const { isLoggedIn, isOwner, validateListing }=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })








router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[img]'),validateListing, wrapAsync(listingController.createRoute))

//Index Route
// router.get("/", wrapAsync(listingController.index));

//New route
router.get("/new", isLoggedIn, wrapAsync(listingController.newRoute));


router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isOwner, upload.single('listing[img]'), wrapAsync(listingController.editRoute))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));


//Create Route
// router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createRoute))

// app.post("/listing", wrapAsync(async (req, res) => {
//     const data = new Listing(req.body.listing);
//     let image = data.img;
//     data.img = image;
//     console.log(data);
//     await data.save();
//     return res.status(200).redirect("/listing");
// }));


//Show Route
//router.get("/:id", wrapAsync(listingController.showRoute))

//Edit Route

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editPageRoute))

//router.put("/:id",isOwner,wrapAsync(listingController.editRoute))

//Delete Route
//router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

module.exports=router;