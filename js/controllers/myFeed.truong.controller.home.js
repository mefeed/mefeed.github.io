(function() {
    'use strict';
    angular.module('myFeed')
        .controller('myFeed.truong.controller.home', [
            '$scope',
            '$state',
            'ArticlesFactory',
            'AuthenticationService',
            '$rootScope',
            '$cookies',
            '$window',
            function($scope, $state, ArticlesFactory, AuthenticationService, $rootScope, $cookies, $window) {
                //****************************set token and username************************** */
                AuthenticationService.login($window.localStorage.email, $window.localStorage.pw);
                console.log($window.localStorage.token);
                if ($window.localStorage.token === undefined) {
                    $scope.displayHome = false;
                } else {
                    $scope.displayHome = true;
                }

                $scope.logout = ($window.localStorage.token === undefined);
                // console.log($rootScope.globals.currentUser);
                $rootScope.globals = $window.localStorage.token;
                const numberTen = 10;
                $scope.feedLoaded = false;
                $scope.tagsLoaded = false;
                $scope.currentPage = 0;
                $scope.articlesCount = 0;
                $scope.message = 'Loading feed...';
                if ($rootScope.globals === undefined) {
                    $scope.listConfig = {
                        type: 'global_feed',
                    };
                    getArticles();
                } else {
                    $scope.listConfig = {
                        type: 'my_feed',
                    };
                    getMyFeed();
                }
                ArticlesFactory.getTag.then(((tags) => {
                    $scope.tagsLoaded = true;
                    $scope.tags = tags.data.tags;
                }));

                $scope.changeList = (data) => {
                    $scope.filtersTag = true;
                    $scope.articles = null;
                    if (data.type === 'tag') {
                        $scope.currentPage = 0;
                        $scope.feedLoaded = false;
                        $scope.listConfig.type = 'all';
                        $scope.tagName = data.filters.tag;
                        var filterTag = ArticlesFactory.getDataFilterTag($scope.tagName);

                        filterTag.then(function successCallback(response) {
                            $scope.feedLoaded = true;
                            $scope.articles = response.data.articles;
                            $scope.articlesCount = response.data.articlesCount;
                            let pageNumber = Math.floor($scope.articlesCount / 10)
                            $scope.pageRange = [...Array(pageNumber).keys()];
                        }, function errorCallback(err) {
                            // console.log(err);
                        });
                    } else if (data.type === 'global_feed') {
                        $scope.filtersTag = false;
                        $scope.feedLoaded = false;
                        $scope.listConfig.type = 'global_feed';
                        getArticles();
                    } else if (data.type === 'my_feed') {
                        $scope.filtersTag = false;
                        $scope.feedLoaded = false;
                        $scope.listConfig.type = 'my_feed';
                        getMyFeed();
                    }
                }
                $scope.changePage = (pageNumber) => {
                    $scope.currentPage = pageNumber;
                    $scope.feedLoaded = false;
                    var dataFilterPage = ArticlesFactory.getDataFilterPageNumber($scope.tagName, pageNumber * numberTen);
                    dataFilterPage.then(function successCallback(response) {
                        $scope.feedLoaded = true;
                        $scope.articles = response.data.articles;
                    }, function errorCallback(err) {
                        // console.log(err);
                    });
                }

                // AuthenticationService.logOut();
                $scope.submit = function(slug, favorited, type) {
                    $scope.isSubmitting = true;
                    if ($rootScope.globals === undefined) {
                        $state.go("signIn");
                        return;
                    }
                    if (favorited) {
                        ArticlesFactory.deleteFavorite(slug)
                            .then(function successCallback(response) {
                                $scope.isSubmitting = false;
                                checkFeed(type);
                            }, function errorCallback(err) {
                                console.log(err);
                            });
                    } else {
                        ArticlesFactory.postFavorite(slug)
                            .then(function successCallback(response) {
                                $scope.isSubmitting = false;
                                checkFeed(type);
                            }, function errorCallback(err) {
                                // console.log(err);
                            });
                    }
                }

                function checkFeed(type) {
                    if (type === "my_feed") {
                        getMyFeed();
                    } else if (type === "global_feed") {
                        getArticles();
                    }
                }

                function getArticles() {
                    $scope.currentPage = 0;
                    ArticlesFactory.getData().then(((items) => {
                        $scope.feedLoaded = true;
                        $scope.articles = items.data.articles;
                        $scope.articlesCount = items.data.articlesCount;
                        let pageNumber = Math.floor($scope.articlesCount / numberTen)
                        $scope.pageRange = [...Array(pageNumber).keys()];
                    }));
                }

                function getMyFeed() {
                    $scope.currentPage = 0;
                    ArticlesFactory.getFeed().then(((items) => {
                        $scope.feedLoaded = true;
                        $scope.articles = items.data.articles;
                        if (items.data.articles.length < 1) {
                            $scope.feedLoaded = false;
                            $scope.articlesCount = items.data.articlesCount;
                            $scope.message = 'No articles are here... yet.';
                            return;
                        }
                        $scope.articlesCount = items.data.articlesCount;
                        let pageNumber = Math.floor($scope.articlesCount / numberTen)
                        $scope.pageRange = [...Array(pageNumber).keys()];
                    }));
                }
            }

        ]);
})();