const express = require('express'),
  router = express.Router();

// "/" Landing Page
router.get('/', function (req, res) {
  res.render('home');
});

module.exports = router;
