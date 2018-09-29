var HolyGround       = require("../models/holyground"),
    Comment          = require("../models/comment"),
    middlewareObject = {};

middlewareObject.checkHolyGroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        HolyGround.findOne({_id: req.params.id}, function (err, foundHolyGround) {
            if (err) {
                res.redirect("back");
            } else {
                if(foundHolyGround.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObject.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()) {
        Comment.findOne({_id: req.params.comment_id}, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


middlewareObject.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObject;