(function() {
    'use strict';
    angular.module('myFeed')
        .controller('myFeed.truong.controller.profile', [
            '$scope',
            '$state',
            '$stateParams',
            'profilesFactory',
            'ArticlesFactory',
            '$rootScope',
            '$window',
            function($scope, $state, $stateParams, profilesFactory, ArticlesFactory, $rootScope, $window) {
                const numberTen = 5;
                $scope.feedLoaded = false;
                $scope.currentPage = 0;
                $scope.articlesCount = 0;
                $scope.pageNumber = 0;
                $scope.message = 'Loading feed...'
                $scope.listConfig = {
                    type: 'my_articles',
                }
                getProfilesUser();
                profilesArticle();

                function getProfilesUser() {
                    var profiles = profilesFactory.getProfile($stateParams.username);
                    profiles.then(function successCallback(profile) {
                        $scope.profile = profile.data.profile;
                        if (profile.data.profile.following) {
                            $scope.follow = "Unfollow";
                        } else {
                            $scope.follow = "Follow";
                        }

                    }, function errorCallback(err) {});
                }


                function profilesArticle() {
                    var profilesArticles = profilesFactory.getArticlesPageNumber($stateParams.username, $scope.pageNumber);
                    profilesArticles.then(function successCallback(article) {
                        $scope.feedLoaded = true;
                        $scope.articles = article.data.articles;
                        $scope.articlesCount = article.data.articlesCount;
                        let pageNumber = Math.floor($scope.articlesCount / numberTen)
                        $scope.pageRange = [...Array(pageNumber).keys()];
                    }, function errorCallback(err) {});
                }

                function favoritedArticles() {
                    var dataFilterPage = profilesFactory.getFavoritedArticlesPageNumber($stateParams.username, $scope.pageNumber * numberTen);
                    dataFilterPage.then(function successCallback(response) {
                        $scope.feedLoaded = true;
                        $scope.articles = response.data.articles;
                        $scope.articlesCount = response.data.articlesCount;
                        if ($scope.articles.length === 0) {
                            $scope.feedLoaded = false;
                            $scope.message = 'No articles are here... yet.';
                        } else {
                            let pageNumber = Math.floor($scope.articlesCount / numberTen)
                            $scope.pageRange = [...Array(pageNumber).keys()];
                        }

                    }, function errorCallback(err) {});
                }

                $scope.changeList = (data) => {
                    if (data.type === 'favorited_articles') {
                        $scope.currentPage = 0;
                        $scope.articles = null;
                        $scope.listConfig.type = 'favorited_articles';
                        favoritedArticles();

                    } else if (data.type === 'my_articles') {
                        $scope.listConfig.type = 'my_articles';
                        profilesArticle();
                    }
                }
                $scope.changePage = (pageNumber) => {
                    $scope.currentPage = pageNumber;
                    $scope.pageNumber = pageNumber;
                    $scope.feedLoaded = false;
                    profilesArticle();
                    favoritedArticles();
                }
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
                            }, function errorCallback(err) {});
                    } else {
                        ArticlesFactory.postFavorite(slug)
                            .then(function successCallback(response) {
                                $scope.isSubmitting = false;
                                checkFeed(type);
                            }, function errorCallback(err) {});
                    }
                }

                function checkFeed(type) {
                    if (type === "favorited_articles") {
                        favoritedArticles();
                    } else if (type === "my_articles") {
                        profilesArticle();
                    }
                }
                $scope.submit = (userName, folowing) => {
                    $scope.isSubmitting = true;
                    if ($rootScope.globals === undefined) {
                        $state.go("signIn");
                        return;
                    }
                    if (folowing) {
                        profilesFactory.deleteFollowUser(userName)
                            .then(function successCallback(response) {
                                $scope.isSubmitting = false;
                                getProfilesUser();
                            }, function errorCallback(err) {});
                    } else {
                        profilesFactory.postFollowUser(userName)
                            .then(function successCallback(response) {
                                $scope.isSubmitting = false;
                                getProfilesUser();
                            }, function errorCallback(err) {});
                    }
                }
            }
        ]);
})();