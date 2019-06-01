var HolyGround = require("../models/holyground"),
  Comment = require("../models/comment"),
  middlewareObject = {};

middlewareObject.checkHolyGroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    HolyGround.findOne({ _id: req.params.id }, function(err, foundHolyGround) {
      if (err || !foundHolyGround) {
        req.flash("error", "Holyground not found");
        res.redirect("back");
      } else {
        if (foundHolyGround.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don´t have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObject.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findOne({ _id: req.params.comment_id }, function(
      err,
      foundComment
    ) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don´t have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObject.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in");
  res.redirect("/login");
};

module.exports = middlewareObject;
