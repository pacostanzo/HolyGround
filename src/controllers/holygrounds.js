const HolyGround = require('../models/holyground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../utils/cloudinary');

module.exports.index = async (req, res) => {
  const holygrounds = await HolyGround.find({});
  const featuresArray = [];
  for (let holyground of holygrounds) {
    featuresArray.push({
      type: 'Feature',
      geometry: holyground.geometry,
      properties: { museum_count: holyground.title },
    });
  }
  const features = { features: featuresArray };
  res.render('holygrounds/index', { holygrounds, features });
};

module.exports.renderNewForm = (req, res) => {
  res.render('holygrounds/new');
};

module.exports.createHolyground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.holyground.location,
      limit: 1,
    })
    .send();
  const holyground = new HolyGround(req.body.holyground);
  holyground.geometry = geoData.body.features[0].geometry;
  holyground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  holyground.author = req.user._id;
  await holyground.save();
  console.log(holyground);
  req.flash('success', 'Successfully made a new holyground!');
  res.redirect(`/holygrounds/${holyground._id}`);
};

module.exports.showHolyground = async (req, res) => {
  const holyground = await HolyGround.findById(req.params.id).populate({
    path: 'author',
    strictPopulate: false,
  });
  await holyground.populate({ path: 'reviews', populate: 'author' });

  if (!holyground) {
    req.flash('error', 'Cannot find that holyground!');
    return res.redirect('/holygrounds');
  }
  res.render('holygrounds/show', { holyground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const holyground = await HolyGround.findById(id);
  if (!holyground) {
    req.flash('error', 'Cannot find that holyground!');
    return res.redirect('/holygrounds');
  }
  res.render('holygrounds/edit', { holyground });
};

module.exports.updateHolyground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const holyground = await HolyGround.findByIdAndUpdate(id, {
    ...req.body.holyground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  holyground.images.push(...imgs);
  await holyground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await holyground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Successfully updated holyground!');
  res.redirect(`/holygrounds/${holyground._id}`);
};

module.exports.deleteHolyground = async (req, res) => {
  const { id } = req.params;
  await HolyGround.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted holyground');
  res.redirect('/holygrounds');
};
