(function() {
    angular.module('myFeed')
        .controller('lam_accountpage_controller', [
            '$scope',
            '$state',
            '$window',
            '$stateParams',
            'common_services_userinfo',
            'lam_accountpage_services',
            function(
                $scope,
                $state,
                $window,
                $stateParams,
                common_services_userinfo,
                lam_accountpage_services
            ) {

                //****************************set token and username************************** */
                common_services_userinfo.setToken($window.localStorage.token);
                common_services_userinfo.setUsername($window.localStorage.username);


                $scope.usernameUrl = $stateParams.username;
                $scope.load_listArticles = (username, token) => {
                    return lam_accountpage_services.listArticles(username, token).$promise
                        .then(data => {
                            $scope.listArticles = data.articles;
                        })
                }
                $scope.load_listArticlesFavorited = (username, token) => {
                    return lam_accountpage_services.listArticlesFavorited(username, token).$promise
                        .then(data => {
                            $scope.listArticlesFavorited = data.articles;
                        })
                }
                $scope.load_listArticlesFavoritedSlug = (username, token) => {
                    return lam_accountpage_services.listArticlesFavorited(username, token).$promise
                        .then(data => {
                            $scope.listArticlesFavoritedSlug = data.articles.map(elm => elm.slug);
                        })
                };
                //****************************toggle article************************** */
                $scope.displayArticle = true;
                $scope.goTolistArticles = () => {
                    $scope.displayArticle = true;
                };
                $scope.toToListArticlesFavorited = () => {
                    $scope.displayArticle = false;
                };
                //****************************follow or seting************************** */
                //follow
                $scope.load_statusMeFollowUser = (username, token) => {
                    return lam_accountpage_services.getProfile(username, token).$promise.then(data => (data.profile.following));
                }
                $scope.checkFollow = (username, token) => {
                    if (username == common_services_userinfo.getUsername()) {
                        $scope.displayBlockFollow = false;
                    } else {
                        $scope.displayBlockFollow = true;
                        $scope.load_statusMeFollowUser(username, token).then((data) => {
                                $scope.statusMeFollowUser = data;
                            })
                            .then(() => {
                                if ($scope.statusMeFollowUser == true) {
                                    $scope.displayFollow = false;
                                } else {
                                    $scope.displayFollow = true;
                                }
                            })
                    }
                }
                $scope.follow = (username, token = common_services_userinfo.getToken()) => {
                    $scope.load_statusMeFollowUser(username, token).then((data) => {
                            $scope.statusMeFollowUser = data;
                        })
                        .then(() => {
                            if ($scope.statusMeFollowUser == true) {
                                return lam_accountpage_services.unfollow(username, token).$promise
                                    .then(data => {
                                        $scope.checkFollow($scope.usernameUrl, common_services_userinfo.getToken());
                                    })
                            } else {
                                return lam_accountpage_services.follow(username, token).$promise
                                    .then(data => {
                                        $scope.checkFollow($scope.usernameUrl, common_services_userinfo.getToken());
                                    })
                            }
                        })
                };

                //****************************profile************************** */
                let profile = lam_accountpage_services.getProfile($scope.usernameUrl, common_services_userinfo.getToken());
                profile.$promise.then(data => {
                        $scope.profile = data.profile;
                    })
                    .then(() => {
                        $scope.usernameUrl = $stateParams.username;
                        $scope.token = common_services_userinfo.getToken();
                        $scope.load_listArticles($scope.usernameUrl, $scope.token);
                    })
                    .then(() => {
                        $scope.load_listArticlesFavorited($scope.usernameUrl, $scope.token);
                        $scope.load_listArticlesFavoritedSlug(common_services_userinfo.getUsername(), $scope.token);
                        $scope.checkFollow($scope.usernameUrl, common_services_userinfo.getToken());
                    })
                    .then(() => {
                        $scope.favorite = (slug) => {
                            //if favorited
                            if ($scope.listArticlesFavoritedSlug.includes(slug) == true) {
                                return lam_accountpage_services.unfavoriteArticle(slug, $scope.token).$promise
                                    .then(() => {
                                        //reload
                                        $scope.load_listArticles($scope.usernameUrl, $scope.token);
                                        $scope.load_listArticlesFavorited($scope.usernameUrl, $scope.token);
                                        $scope.load_listArticlesFavoritedSlug(common_services_userinfo.getUsername(), $scope.token);
                                    })
                            };
                            //if unfavorited
                            return lam_accountpage_services.favoriteArticle(slug, $scope.token).$promise
                                .then(() => {
                                    //reload
                                    $scope.load_listArticles($scope.usernameUrl, $scope.token);
                                    $scope.load_listArticlesFavorited($scope.usernameUrl, $scope.token);
                                    $scope.load_listArticlesFavoritedSlug(common_services_userinfo.getUsername(), $scope.token);
                                });
                        }
                    })
                    .then(() => {
                        // $state.go("lam_accountpage.listArticles");
                    })
            }
        ])
})();;