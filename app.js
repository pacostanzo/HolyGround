var express    = require("express"),
    bodyParser = require("body-parser"),
    app        =  express(),
    mongoose   = require("mongoose"),
    HolyGround = require("./models/holyground"),
    seedsDB    = require("./seeds");

mongoose.connect("mongodb://localhost/holy_ground",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedsDB();

// "/" Landing Page
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX - show all holygrounds
app.get("/holygrounds", function (req, res) {
    //Get all holygrounds fom DB
    HolyGround.find({}, function (err, allHolyGrounds) {
       if(err){
            console.log(err);
       } else {
           res.render("index", {holygrounds: allHolyGrounds});
       }
    });
});

//NEW - show form to create new campground
app.get("/holygrounds/new", function (req, res) {
    res.render("new.ejs");
});

//CREATE - add new campground to DB
app.post("/holygrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newHolyGround = {name: name, image: image, description: description};
    HolyGround.create(newHolyGround, function (err, newlyCreated) {
       if (err) {
           console.log(err);
       } else {
           res.redirect("/holygrounds");
       }
    });
});

//SHOW - show more info about one holyground
app.get("/holygrounds/:id", function (req, res) {
    HolyGround.findOne({_id: req.params.id}).populate("comments").exec(function (err, foundHolyGround) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {holyground: foundHolyGround});
        }
    });
});

app.listen(3001, 'localhost', function() {
    console.log("Suelo Sagrado server has started...");
});