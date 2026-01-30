const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signUp.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      req.login(registeredUser,(err)=>{
        if (err){return next(err)}
        req.flash("success", "welcome to Staysphere!");
        res.redirect("/listings");
      });
     } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signUp");
    }
  };


module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.logIn =  (req, res) => {
    req.flash("success", "Welcome back to Staysphere!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out!");
        res.redirect('/listings');
    })
}