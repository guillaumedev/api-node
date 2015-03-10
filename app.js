// =========================================
// SET UP ==================================
// =========================================
var express = require('express');
var app = express();
var init = require('./bin/www'); // contains database configuation with orm sequelize.js
var path = require('path');
var passport = require('passport');

var dotenv = require('dotenv');
dotenv.load();

var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
}

// =========================================
// EXPRESS REQUIRED ========================
// =========================================
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'public')));

// =========================================
// BOOTSTRAP PASSPORT CONFIG ===============
// =========================================
require('./config/passport')(passport); // pass passport for configuration

// =========================================
// PASSPORT REQUIRED =======================
// =========================================
app.use(session({
  secret: 'boxstory',
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// =========================================
// ROUTES ==================================
// =========================================
//require('./routes/index.js')(app, passport);
app.use('/', routes);
app.use('/users', users);

// =========================================
// 404 & ERROR =============================
// =========================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
