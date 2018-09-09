var express       = require("express"),
    bodyParser    = require("body-parser"),
    app           =  express(),
    mongoose      = require("mongoose"),
    passpport     = require("passport"),
    LocalStrategy = require("passport-local"),
    HolyGround    = require("./models/holyground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedsDB       = require("./seeds");

mongoose.connect("mongodb://localhost/holy_ground",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedsDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Barrilete cosmico de que planeta viniste!",
    resave: false,
    saveUninitialized: false
}));

app.use(passpport.initialize());
passpport.use(new LocalStrategy(User.authenticate()));
passpport.serializeUser(User.serializeUser());
passpport.deserializeUser(User.deserializeUser());

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

// AUTH ROUTES

//show register form
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passpport.authenticate("local")(req, res, function () {
            res.redirect("/holygrounds")
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passpport.authenticate("local",
    {
        successRedirect: "/holygrounds",
        failureRedirect: "/login"
    }),function (req, res) {
    res.render("login");
});

app.listen(3001, 'localhost', function() {
    console.log("Suelo Sagrado server has started...");
});