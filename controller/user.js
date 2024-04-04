const User=require("../model/user.js");


module.exports.renderSignUpForm = (req, res)=>{
    res.render("user/signup.ejs");
}


module.exports.signUpUser = async(req, res)=>{
    try{
        let{username, email, password}=req.body;
        let user1=new User({
            username,
            email,
        })
        let result= await User.register(user1, password);
        console.log(result);
        req.login(user1, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to the wanderlust")
            res.redirect("/listing");
        })
    }catch(err){
        req.flash("error", `${err.message}, please go with login`);
        res.redirect("/login");
    }
}

module.exports.renderLoginForm=(req, res)=>{
    res.render("user/login.ejs");
}

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logoutUser=(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listing");
    })
}