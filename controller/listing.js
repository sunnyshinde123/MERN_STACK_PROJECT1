const Listing = require("../model/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index=async (req, res)=>{
    let data= await Listing.find({});
    res.render("listing/index.ejs", {data});
};

module.exports.newRoute=(req, res)=>{
    res.render("listing/new.ejs");
};

module.exports.createRoute= async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
        
    let url=req.file.path;
    let fileName=req.file.filename;
    let data = new Listing(req.body.listing);
    data.owner=req.user._id;
    data.img={url, fileName};
    data.geometry=response.body.features[0].geometry;
    let result=await data.save();
    console.log(result);
    req.flash("success", "new listing added");
    res.redirect("/listing");
};

module.exports.showRoute = async(req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id).
    populate({
        path:"review",
        populate:({
            path:"author"
        })
    }).populate("owner");
    if(!data){
        req.flash("error", "Listing you requested does not exists");
        return res.redirect("/listing");
    }
    res.render("listing/show.ejs", {data});
};

module.exports.editPageRoute=async (req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
        req.flash("error", "Listing you requested does not exists");
        res.redirect("/listing");
    }
    let originalUrl=data.img.url;
    originalUrl=originalUrl.replace("/upload", "/upload/ar_1.0,c_fill,h_200/bo_5px_solid_lightblue");
    res.render("listing/edit.ejs",{data, originalUrl});
};

module.exports.editRoute=async(req, res)=>{
    let {id}=req.params;
    // let {title: newTitle, description: desc, img: imgUrl, price: priceAmt, location: locationPoint, country: countryPoint}=req.body;
    // await Listing.findByIdAndUpdate(id, {title:newTitle, description:desc, img:imgUrl, price:priceAmt, location:locationPoint, country:countryPoint});
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let fileName=req.file.filename;
        listing.img={url, fileName};
        await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect("/listing");
};

module.exports.deleteRoute=async(req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listing");
};

