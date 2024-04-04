// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const engineMate = require('ejs-mate');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

// Routes
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// Utilities
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchemaJoi, reviewSchemaJoi } = require("./schema.js");

// Initialize Express app
const app = express();

// Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engineMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session store configuration
const atlas_db = `${process.env.ATLAS_DB}`;
const secret = `${process.env.SECRET}`;
const port = process.env.PORT;
const store = MongoStore.create({
    mongoUrl: atlas_db,
    crypto: { secret },
    touchAfter: 24 * 3600 // time period in seconds
});
store.on("error", (err) => {
    console.log("Error in mongo session store ", err);
});
const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOptions));

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database connection
(async () => {
    try {
        await mongoose.connect(atlas_db);
        console.log("DB is Connected");
    } catch (err) {
        console.log(err);
    }
})();

// Middleware to pass locals to views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currSessionUser = req.user;
    next();
});

// Routes
app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/", userRoute);

// Error Handling Middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Internal server Error" } = err;
    res.status(status).render("error.ejs", { err });
});

// Start server
app.listen(port, () => {
    console.log("Successfully Connected to the port of 5050");
});