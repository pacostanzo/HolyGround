var express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport/lib"),
  LocalStrategy = require("passport-local/lib"),
  methodOverride = require("method-override"),
  User = require("./models/user"),
  flash = require("connect-flash/lib");
const path = require("path");

// Requiring routes
var indexRoutes = require("./routes"),
  commentsRoutes = require("./routes/comments"),
  holyGroundsRoutes = require("./routes/holygrounds");

var url = process.env.DATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsDirectoryPath = path.join(__dirname, "../views");

// Setup ejs engine and views location
app.set("view engine", "ejs");
app.set("views", viewsDirectoryPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Barrilete cosmico de que planeta viniste!",
    resave: false,
    saveUninitialized: false
  })
);

app.locals.moment = require("moment/moment");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

// Add current users to all the templates.
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/holygrounds", holyGroundsRoutes);
app.use("/holygrounds/:id/comments", commentsRoutes);

module.exports = app;
