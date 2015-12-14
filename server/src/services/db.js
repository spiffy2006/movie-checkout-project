var fs = require('fs-extra');
var db = require('../db.json');

var exports = module.exports = {};

var saveDb = function() {
    fs.removeSync('../db.json');
    fs.writeJson('./src/db.json', db, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(err);
    });
};

exports.getMovies = function(req, res) {
    var movies = [];

    for(var k in db.movies) {
        movies.push(db.movies[k]);
    }
    res.end(JSON.stringify(movies));
};

exports.addMovie = function(movie) {
    db.movies[movie.link] = movie;
    saveDb();
};

exports.getMovie = function(req, res) {
    var movieLink = decodeURIComponent(req.params.link);
    res.end(JSON.stringify(db.movies[movieLink]));
};

exports.getUsers = function(req, res) {
    res.end(JSON.stringify(db.users));
};

exports.addUser = function(req, res) {
    var fullName = req.params.firstName + " " + req.params.lastName;
    db.users[fullName] = {first: req.params.firstName, last: req.params.lastName, fullName: fullName, movies: []};
    saveDb();
    res.end(JSON.stringify(db.users[fullName]));
};

exports.getUser = function(req, res) {
    res.end(JSON.stringify(db.users[req.params.fullName]));
};

exports.checkOutMovie = function(req, res) {
    db.movies[req.params.movieLink].checkedOut = true;
    db.movies[req.params.movieLink].checkedOutTo = req.params.fullName;
    db.users[req.params.fullName].movies.push(req.params.movieLink);
    saveDb();
    res.json(db.movies);
};

exports.checkInMovie = function(req, res) {
    db.movies[req.params.movieLink].checkedOut = false;
    db.movies[req.params.movieLink].checkedOutTo = '';

    var index = db.users[req.params.fullName].movies.indexOf(req.params.movieLink);
    db.users[req.params.fullName].movies.splice(index, 1);
    saveDb();
    res.end(JSON.stringify(db.movies));
};