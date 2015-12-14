// Print all of the news items on Hacker News 
var jsdom = require("jsdom");
var db = require('./db');
var exports = module.exports = {};

var sanitizeQuery = function(query) {
    return query;
};

exports.search = function(req, res) {
    jsdom.env({
        url: "http://www.imdb.com/find?ref_=nv_sr_fn&q=" + sanitizeQuery(req.params.query) + "&s=tt",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            var $ = window.$;
            var titles = [];
            var tmp;

            $('.findList tr').each(function() {
                tmp = {
                    photo: $(this).find('.primary_photo > a > img').attr('src'),
                    link: "http://www.imdb.com" + $(this).find('.result_text > a').attr('href'),
                    title: $(this).find('.result_text > a').text()
                };
                titles.push(tmp);
            });

            res.end(JSON.stringify(titles));
        }
    });
};

exports.getMovie = function(req, res) {
    jsdom.env({
        url: req.params.link,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            var $ = window.$;
            var movie = {
                link: req.params.link,
                title: $('#title-overview-widget #overview-top h1 span.itemprop').text(),
                photo: $('#title-overview-widget .image > a > img').attr('src'),
                rating: $('#title-overview-widget #overview-top .infobar meta').attr('content'),
                duration: $('#title-overview-widget #overview-top .infobar time').text().replace("\n", '').trim(),
                genre: $('#title-overview-widget #overview-top .infobar a span[itemprop="genre"]').text(),
                description: $('#title-overview-widget p[itemprop="description"]').text(),
                releaseDate: new Date($('#title-overview-widget #overview-top .infobar span.nobr > a > meta[itemprop="datePublished"]').attr('content')),
                checkedOut: false,
                checkedOutTo: ''
            };

            db.addMovie(movie);

            res.end(JSON.stringify(movie));
        }
    });
};