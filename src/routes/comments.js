var express = require("express"),
  router = express.Router({ mergeParams: true }),
  HolyGround = require("../models/holyground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  HolyGround.findOne({ _id: req.params.id }, function(err, holyground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { holyground: holyground });
    }
  });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  HolyGround.findOne({ _id: req.params.id }, function(err, holyground) {
    if (err) {
      console.log(err);
      res.redirect("/holygrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          holyground.comments.push(comment);
          holyground.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/holygrounds/" + holyground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  HolyGround.findOne({ _id: req.params.id }, function(err, foundHolyGround) {
    if (err || !foundHolyGround) {
      req.flash("error", "No HolyGround found");
      res.redirect("back");
    }
  });
  Comment.findOne({ _id: req.params.comment_id }, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        holyground_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findOneAndUpdate(
    { _id: req.params.comment_id },
    req.body.comment,
    function(err, updatedComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/holygrounds/" + req.params.id);
      }
    }
  );
});

//DESTROY comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findOneAndDelete({ _id: req.params.comment_id }, function(
    err,
    deleteComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/holygrounds/" + req.params.id);
    }
  });
});

module.exports = router;
