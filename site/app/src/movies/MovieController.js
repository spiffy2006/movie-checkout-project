(function(){

  angular
       .module('movies')
       .controller('MovieController', [
          'movieService', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$mdMedia', '$mdToast', '$log', '$q', '$scope',
          MovieController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MovieController( movieService, $mdSidenav, $mdBottomSheet, $mdDialog, $mdMedia, $mdToast, $log, $q, $scope) {
    var self = this;

    self.selected     = null;
    self.movies        = [ ];
    self.firstName = null;
    self.lastName = null;
    self.name = null;
    self.selectMovie   = selectMovie;
    self.toggleList   = toggleMoviesList;
    self.showContactOptions  = showContactOptions;

    // autocomplete vars
    self.simulateQuery = false;
    self.isDisabled    = false;
    self.userData;
    self.users;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    /**
     *  Autocomplete functions
     */

     movieService.getUsers()
     .then(function(users) {
        self.userData = users;
        self.users = loadAll(Object.keys(users));
     });

    function querySearch (query) {
      var results = query ? self.users.filter( createFilterFor(query) ) : self.users,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        if (typeof item != 'undefined')
            self.name = item.display;
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll(users) {
      return users.map( function (user) {
        return {
          value: user.toLowerCase(),
          display: user
        };
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(user) {
        return (user.value.indexOf(lowercaseQuery) === 0);
      };
    }

    // Load all registered users

    movieService
        .getMovies()
        .then(function(movies) {
            self.movies = movies;
        });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleMoviesList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    self.finishCheckOut = function() {
        movieService
        .getMovies()
        .then(function(movies) {
            self.movies = movies;
        });
    };

    self.checkInMovie = function() {
        movieService.checkInMovie(self.selected.link, self.selected.checkedOutTo)
        .then(function(updatedMovies) {
            if (updatedMovies) {
                self.movies = updatedMovies;
                self.selected = updatedMovies[self.selected.link];
                self.searchText = '';
            } else {
                console.log('There was a problem checking out the movie.')
            }
        });
    };

    self.checkoutMovie = function() {
        movieService.checkOutMovie(self.selected.link, self.name)
        .then(function(updatedMovies) {
            if (updatedMovies) {
                self.movies = updatedMovies;
                self.selected = updatedMovies[self.selected.link];
            } else {
                console.log('There was a problem checking out the movie.')
            }                
        });
    };

    /**
     * Add user dialog
     */
    self.status = '  ';
    self.addUserDialog = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './src/templates/add-user.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $mdMedia('sm') && $scope.customFullscreen
        })
        .then(function(answer) {
            self.status = 'You said the information was "' + answer + '".';
        }, function() {
            self.status = 'You cancelled the dialog.';
        });
        $scope.$watch(function() {
            return $mdMedia('sm');
        }, function(sm) {
            self.customFullscreen = (sm === true);
        });
    };

    function DialogController($scope, $mdDialog, $mdToast) {
        $scope.firstName = '';
        $scope.lastName = '';
        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }
        $scope.showSimpleToast = function() {
        $mdToast.show(
            $mdToast.simple()
                .textContent('User Added!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
      };
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.addUser = function(answer) {
            movieService.addUser({firstName: $scope.firstName, lastName: $scope.lastName})
            .then(function(updated) {
                $mdDialog.hide();
                $scope.showSimpleToast();
                return movieService.getUsers();     
            })
            .then(function(users) {
                self.userData = users;
                self.users = loadAll(Object.keys(users));
             });
        };
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectMovie ( movie ) {
        self.selected = movie;
        self.name = null;
        self.lastName = null;
        self.firstName = null;      
        self.searchText = movie.checkedOutTo != '' ? movie.checkedOutTo : '';
        self.selectedItem = undefined;
        self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var movie = self.selected;

        return $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: './src/movies/view/contactSheet.html',
          controller: [ '$mdBottomSheet', MoviePanelController],
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function MoviePanelController( $mdBottomSheet ) {
            this.movieResults = [];
            this.addMovie = function(movieLink) {
                movieService.addMovie(movieLink)
                .then(function(added) {
                    return movieService.getMovies();
                })
                .then(function(movies) {
                    self.movies = movies;
                });
            };
            this.searchMovies = function(movieSearch) {
                var scope = this;
                movieService.search(movieSearch)
                .then(function(movieList) {
                    scope.movieResults = movieList;
                });
            };
        }
    }

  }

})();
