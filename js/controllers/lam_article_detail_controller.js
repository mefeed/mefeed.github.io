(() => {
    angular.module("myFeed")
        .controller("lam_article_detail_controller", [
            '$window',
            '$scope',
            '$stateParams',
            '$state',
            'lam_accountpage_services',
            'common_services_userinfo',
            function(
                $window,
                $scope,
                $stateParams,
                $state,
                lam_accountpage_services,
                common_services_userinfo
            ) {
                //****************************set token and username************************** */
                common_services_userinfo.setToken($window.localStorage.token);
                common_services_userinfo.setUsername($window.localStorage.username);
                $scope.displayComment = false;
                $scope.displayComment = true;

                if (common_services_userinfo.getToken() === undefined) {
                    $scope.displayComment = false;
                }

                //load my slug article i am favorited
                $scope.load_listArticlesFavoritedSlug = (username, token) => {
                    return lam_accountpage_services.listArticlesFavorited(username, token).$promise
                        .then(data => data.articles.map(elm => elm.slug))
                };
                $scope.reload = () => {
                    $scope.load_listArticlesFavoritedSlug(common_services_userinfo.getUsername(), common_services_userinfo.getToken())
                        .then(data => {
                            $scope.listArticlesFavoritedSlug = data;
                        })
                        .then(() => {
                            $scope.checkFavorite($scope.listArticlesFavoritedSlug, $scope.articleSlug);
                        });
                    lam_accountpage_services.getArticle($stateParams.slug).$promise
                        .then(data => {
                            $scope.article = data.article;
                            $scope.articleSlug = data.article.slug;
                            $scope.author = data.article.author.username;
                        })
                        .then(() => {
                            $scope.load_statusMeFollowUser($scope.author, common_services_userinfo.getToken()).then((data) => {
                                $scope.statusMeFollowUser = data;
                            });
                            $scope.checkFollow($scope.author, common_services_userinfo.getToken());
                            $scope.getComment($scope.articleSlug).then(data => {
                                $scope.comments = data;
                            })
                        })
                };
                $scope.checkFavorite = (myFavorite, articleSlug) => {
                    if (myFavorite.includes(articleSlug) == true) {
                        $scope.displayFavorite = true;
                    } else {
                        $scope.displayFavorite = false;
                    }
                };
                //******************************follow************************************ */
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
                    if (common_services_userinfo.getToken() === undefined) {
                        $state.go("signIn");
                    }
                    $scope.load_statusMeFollowUser(username, token).then((data) => {
                            $scope.statusMeFollowUser = data;
                        })
                        .then(() => {
                            if ($scope.statusMeFollowUser == true) {
                                return lam_accountpage_services.unfollow(username, token).$promise
                                    .then(data => {
                                        $scope.reload();
                                    })
                            } else {
                                return lam_accountpage_services.follow(username, token).$promise
                                    .then(data => {
                                        $scope.reload();
                                    })
                            }
                        })
                };
                //******************************delete edit article************************************ */
                $scope.editArticle = (slug) => {
                    $state.go("editArticle", { slug: slug });
                }
                $scope.deleteArticle = (slug) => {
                    lam_accountpage_services.deleteArticle(slug, common_services_userinfo.getToken()).$promise.then(res => {
                        $state.go("lam_accountpage", { username: common_services_userinfo.getUsername() })
                    })
                };
                //******************************Get comment************************************ */
                $scope.checkDisplayEditComment = (username) => {
                    if (username == common_services_userinfo.getUsername()) {
                        return true;
                    } else {
                        return false;
                    }
                }
                $scope.getComment = (slug) => {
                    return lam_accountpage_services.getComment(slug).$promise.then(data => {
                        return data.comments;
                    });
                };
                $scope.postComment = (slug) => {
                    return lam_accountpage_services.addComment(slug, $scope.textComment, common_services_userinfo.getToken()).$promise.then(() => {
                        $scope.reload();
                        $scope.textComment = "";
                    });
                };
                $scope.deleteComment = (slug, id, token = common_services_userinfo.getToken()) => {
                    lam_accountpage_services.deleteComment(slug, id, token).$promise.then(() => {
                        $scope.reload();
                    });
                };
                //******************************getArticle************************************ */
                lam_accountpage_services.getArticle($stateParams.slug).$promise
                    .then(data => {
                        $scope.article = data.article;
                        $scope.articleSlug = data.article.slug;
                        $scope.author = data.article.author.username;
                    })
                    .then(() => {
                        $scope.load_listArticlesFavoritedSlug(common_services_userinfo.getUsername(), common_services_userinfo.getToken())
                            .then(data => {
                                $scope.listArticlesFavoritedSlug = data;
                            })
                            .then(() => {
                                $scope.checkFavorite($scope.listArticlesFavoritedSlug, $scope.articleSlug);
                            });
                        //check follow
                        $scope.checkFollow($scope.author, common_services_userinfo.getToken());
                        //get comment
                        $scope.getComment($scope.articleSlug)
                            .then(data => {
                                $scope.comments = data;
                            });
                    })
                    .then(() => {
                        //action click favorite
                        $scope.favorite = (slug) => {
                            if (common_services_userinfo.getToken() === undefined) {
                                $state.go("signIn");
                            }
                            //if favorited
                            if ($scope.listArticlesFavoritedSlug.includes(slug) == true) {
                                return lam_accountpage_services.unfavoriteArticle(slug, common_services_userinfo.getToken()).$promise
                                    .then(() => {
                                        //reload
                                        $scope.reload();
                                    })
                            };
                            //if unfavorited
                            return lam_accountpage_services.favoriteArticle(slug, common_services_userinfo.getToken()).$promise
                                .then(() => {
                                    //reload
                                    $scope.reload();
                                });
                        };
                    });
                //get img current to commnet
                lam_accountpage_services.getProfile(common_services_userinfo.getUsername(), common_services_userinfo.getToken()).$promise.then(data => {
                    $scope.currentLogin = {
                        image: data.profile.image
                    }
                });
            }
        ])
})();