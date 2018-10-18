                     require('dotenv').config();
var express        = require("express"),
    bodyParser     = require("body-parser"),
    app            =  express(),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/user"),
    flash          = require("connect-flash");

// Requiring routes
var indexRoutes       = require("./routes/index"),
    commentsRoutes    = require("./routes/comments"),
    holyGroundsRoutes = require("./routes/holygrounds");

var url = process.env.DATABASEURL || "mongodb://localhost/holy_ground";
mongoose.connect(url,{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Barrilete cosmico de que planeta viniste!",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

// Add current users to all the templates.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});


app.use("/",indexRoutes);
app.use("/holygrounds", holyGroundsRoutes);
app.use("/holygrounds/:id/comments",commentsRoutes);

//Connecting the Server
var port = process.env.PORT || 3001;

app.listen(port,function() {
    console.log("Suelo Sagrado server has started at PORT = " + port);
});