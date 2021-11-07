const HolyGround = require('../models/holyground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const holyground = await HolyGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  holyground.reviews.push(review);
  await review.save();
  await holyground.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/holygrounds/${holyground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await HolyGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review');
  res.redirect(`/holygrounds/${id}`);
};
