var express  = require("express"),
    router   = express.Router(),
    passport = require("passport/lib"),
    User     = require("../models/user");

// "/" Landing Page
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// Create a user
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success",  "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/holygrounds")
        });
    });
});


//show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login', message: req.flash("error")});
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/holygrounds",
        failureRedirect: "/login"
    }), function(req, res){
});


router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/holygrounds");
});

module.exports = router;