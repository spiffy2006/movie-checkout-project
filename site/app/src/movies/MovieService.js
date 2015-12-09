(function(){
  'use strict';

  angular.module('movies')
         .service('movieService', ['$http', MovieService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function MovieService($http){
    return {
        getMovies: function() {
            return $http.get('/db-api/movies')
            .then(function(movies) {
                return movies.data;
            })
            .catch(function(err)    {
                console.log(err);
            })
        },
        addMovie: function(movieLink) {
            return $http.get('/imdb-api/movie/' + encodeURIComponent(movieLink))
            .then(function(movie) {
                return movie.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        },
        getUsers: function() {
            return $http.get('/db-api/users')
            .then(function(users) {
                return users.data;
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        addUser: function(user) {
            return $http.get('/db-api/users/add/' + user.firstName + '/' + user.lastName)
            .then(function(success) {
                return success.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        },
        search: function(query) {
            return $http.get('/imdb-api/search/' + encodeURIComponent(query))
            .then(function(movies) {
                return movies.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        },
        checkOutMovie: function(movieLink, fullName) {
            return $http.get('/db-api/checkout/' + encodeURIComponent(movieLink) + '/' + fullName)
            .then(function(updatedMovies) {
                return updatedMovies.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        },
        checkInMovie: function(movieLink, fullName) {
            return $http.get('/db-api/checkin/' + encodeURIComponent(movieLink) + '/' + fullName)
            .then(function(updatedMovies) {
                return updatedMovies.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        },
    };
  }

})();
