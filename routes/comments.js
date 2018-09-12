var express       = require("express"),
    router        = express.Router({mergeParams: true}),
    HolyGround    = require("../models/holyground"),
    Comment       = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, function(req, res) {
    HolyGround.findOne({_id: req.params.id}, function (err, holyground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {holyground: holyground});
        }
    });
}) ;


//Comments Create
router.post("/", isLoggedIn,function (req, res) {
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

// Middleware todo refactor own file
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;