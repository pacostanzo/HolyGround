const express = require('express');
const router = express.Router();
const holygrounds = require('../controllers/holygrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHolyground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(holygrounds.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateHolyground,
    catchAsync(holygrounds.createHolyground)
  );

router.get('/new', isLoggedIn, holygrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(holygrounds.showHolyground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateHolyground,
    catchAsync(holygrounds.updateHolyground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(holygrounds.deleteHolyground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(holygrounds.renderEditForm)
);

module.exports = router;
