// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var mongo = require("mongodb").MongoClient;
var dataURL = process.env.MONGOLAB_URI;
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect('mongodb://heroku_70mgf6nm:4aca267b2j0bf0df8h3tvbruji@ds133094.mlab.com:33094/heroku_70mgf6nm'); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use("/public/css",express.static(__dirname + "/public/css")); // get css
app.use("/public/img",express.static(__dirname + "/public/img")); // get images
app.use("/public/audio",express.static(__dirname + "/public/audio")); // get audio samples
app.use("/public/dist",express.static(__dirname + "/public/dist")); // get compiled audio fx
app.use("/public/scripts",express.static(__dirname + "/public/scripts")); //get scripts
app.use("/public/src",express.static(__dirname + "/public/src")); //get src
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
