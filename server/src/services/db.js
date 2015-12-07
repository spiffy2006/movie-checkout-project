var fs = require('fs-extra');
var db = require('../db.json');

var exports = module.exports = {};

var saveDb = function() {
    fs.removeSync('../db.json');
    console.log(JSON.stringify(db));
    fs.writeJson('./src/db.json', db, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(err);
    });
};

exports.getMovies = function(req, res) {
    res.end(JSON.stringify(db.movies));
};

exports.addMovie = function(movie) {
    db.movies[movie.link] = movie;
    saveDb();
};

exports.getMovie = function(req, res) {
    var movieLink = decodeURIComponent(req.params.link);
    console.log(movieLink);
    res.end(JSON.stringify(db.movies[movieLink]));
};

exports.getUsers = function(req, res) {
    res.end(JSON.stringify(db.users));
};

exports.addUser = function(req, res) {
    var fullName = req.params.first_name + " " + req.params.last_name;
    db.users[fullName] = {first: req.params.first_name, last: req.params.last_name, fullName: fullName};
    saveDb();
    res.end(JSON.stringify(db.users[fullName]));
};

exports.getUser = function(req, res) {
    res.end(JSON.stringify(db.users[req.params.fullName]));
};