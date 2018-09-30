var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// "/" Landing Page
router.get("/", function (req, res) {
    res.render("landing");
});


//show register form
router.get("/register", function (req, res) {
    res.render("register");
});

// Create a user
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err) {
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to HolyGround " + user.username);
            res.redirect("/holygrounds")
        });
    });
});

// LogIn
router.get("/login", function (req, res) {
    res.render("login", {message: req.flash("error")});
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