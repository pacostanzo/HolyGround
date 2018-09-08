var express    = require("express"),
    bodyParser = require("body-parser"),
    app        =  express(),
    mongoose   = require("mongoose"),
    HolyGround = require("./models/holyground"),
    Comment = require("./models/comment"),
    seedsDB    = require("./seeds");

mongoose.connect("mongodb://localhost/holy_ground",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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
           res.render("holygrounds/index", {holygrounds: allHolyGrounds});
       }
    });
});

//NEW - show form to create new campground
app.get("/holygrounds/new", function (req, res) {
    res.render("holygrounds/new");
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
            res.render("holygrounds/show", {holyground: foundHolyGround});
        }
    });
});

/* ===========================================
 *          COMMENTS ROUTES
 * ===========================================*/

app.get("/holygrounds/:id/comments/new", function (req, res) {
    HolyGround.findOne({_id: req.params.id}, function (err, holyground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {holyground: holyground});
        }
    });
}) ;


//CREATE - add new campground to DB
app.post("/holygrounds/:id/comments", function (req, res) {
    HolyGround.findOne({_id: req.params.id}, function (err, holyground) {
        if (err) {
            console.log(err);
            res.redirect("/holygrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    holyground.comments.push(comment)
                    holyground.save();
                    res.redirect("/holygrounds/" + holyground._id);
                }
            });
        }
    });
});

app.listen(3001, 'localhost', function() {
    console.log("Suelo Sagrado server has started...");
});