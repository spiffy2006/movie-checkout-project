var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var imdbApi = require('./services/imdb-api');
var dbApi = require('./services/db');

var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/imdb-api/search/:query', imdbApi.search);
app.get('/imdb-api/movie/:link', imdbApi.getMovie);

app.get('/db-api/users', dbApi.getUsers);
app.get('/db-api/users/:fullName', dbApi.getUser);
app.get('/db-api/users/add/:firstName/:lastName', dbApi.addUser);

app.get('/db-api/movies', dbApi.getMovies);
app.get('/db-api/movies/:link', dbApi.getMovie);

app.get('/db-api/checkout/:movieLink/:fullName', dbApi.checkOutMovie);
app.get('/db-api/checkin/:movieLink/:fullName', dbApi.checkInMovie);

/**
 * Development Settings
 */
if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../../site')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../../site/.tmp')));
    app.use(express.static(path.join(__dirname, '../../site/app')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {

    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

app.listen(8080);

module.exports = app;
