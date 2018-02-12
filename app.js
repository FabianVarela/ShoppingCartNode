var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var parser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
var messages = require('express-messages');
var config = require('./config/database');
var routes = require('./routes/pages');
var routesAdmin = require('./routes/admin_pages');
var routesCategory = require('./routes/admin_categories');

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

//  set global errors
app.locals.errors = null;

//  set body parser middleware
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

//  set express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//  set express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//  set express messages middleware
app.use(connectFlash());
app.use(function (req, res, next) {
    res.locals.messages = messages(req, res);
    next();
});

//  set routes
app.use('/', routes);
app.use('/adminPages', routesAdmin);
app.use('/adminCategories', routesCategory);

//  start the app
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`The server is on the port ${port}`);
});
