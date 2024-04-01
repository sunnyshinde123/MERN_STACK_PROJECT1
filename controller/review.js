const Listing=require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.createPostRoute= async(req, res)=>{
    let data=new Review(req.body.review);
    data.author=req.user._id;
    let listing= await Listing.findById(req.params.id);
    listing.review.push(data);
    await data.save();
    console.log(data);
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.deleteRoute = async(req, res)=>{
    let {id, reviewId}=req.params;
    let reviewid=await Review.findById(reviewId);
    if(!reviewid.author.equals(res.locals.currSessionUser._id)){
        req.flash("error", "you don't have permission to delete this review");
        return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listing/${id}`);
}