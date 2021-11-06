const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Requiring routes
var indexRoutes = require('./routes');

var url = process.env.DATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../views');

// Setup ejs engine and views location
app.set('view engine', 'ejs');
app.set('views', viewsDirectoryPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.use('/', indexRoutes);

module.exports = app;
