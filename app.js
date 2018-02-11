var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');

//  connect to mongo.
mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('connected to MongoDB');
});

//  init app
var app = express();

//  setup the engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  set 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//  routes
app.get('/', function (req, res) {
    res.render('index');
});

//  start the app
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`The server is on the port ${port}`);
});
