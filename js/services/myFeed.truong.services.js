(function() {
    'use strict';

    var baseUrl = 'https://conduit.productionready.io/api';
    var services = angular.module('myFeed');
    services.factory('ArticlesFactory', function($resource, $http, $rootScope, $window) {
        var token = $window.localStorage.token;
        return {
            // getData : $http.get(`${baseUrl}/articles?limit=10`),
            getTag: $http.get(`${baseUrl}/tags`),
            getData: function() {
                if (token === undefined) {
                    return $http({
                        method: 'GET',
                        url: `${baseUrl}/articles?limit=10`,
                    });
                }
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles?limit=10`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            getFeed: function() {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles/feed?limit=10&offset=0`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            getDataFilterTag: function(tag) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles?limit=10&offset=0&tag=${tag}`,
                });
            },
            getDataFilterPageNumber: function(tag, pageNumber) {
                if (tag === undefined) {
                    return $http({
                        method: 'GET',
                        url: `${baseUrl}/articles?limit=10&offset=${pageNumber}`,
                    });
                }
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles?limit=10&offset=${pageNumber}&tag=${tag}`,
                });
            },
            postFavorite: function(slug) {
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/articles/${slug}/favorite`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            deleteFavorite: function(slug) {
                return $http({
                    method: 'DELETE',
                    url: `${baseUrl}/articles/${slug}/favorite`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            }
        };
    });
    services.factory('profilesFactory', function($resource, $http, $rootScope, $window) {
        var token = $window.localStorage.token;
        return {
            getProfile: function(userName) {
                if (token === undefined) {
                    return $http({
                        method: 'GET',
                        url: `${baseUrl}/profiles/${userName}`,
                    });
                }
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/profiles/${userName}`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            postFollowUser: function(userName) {
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/profiles/${userName}/follow`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            deleteFollowUser: function(userName) {
                return $http({
                    method: 'DELETE',
                    url: `${baseUrl}/profiles/${userName}/follow`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            getArticlesPageNumber: function(userName, pageNumber) {
                if (token === undefined) {
                    return $http({
                        method: 'GET',
                        url: `${baseUrl}/articles?author=${userName}&limit=5&offset=${pageNumber}`
                    });
                }
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles?author=${userName}&limit=5&offset=${pageNumber}`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
            getFavoritedArticlesPageNumber: function(userName, pageNumber) {
                if (token === undefined) {
                    return $http({
                        method: 'GET',
                        url: `${baseUrl}/articles?favorited=${userName}&limit=5&offset=${pageNumber}`
                    });
                }
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles?favorited=${userName}&limit=5&offset=${pageNumber}`,
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
            },
        };
    });
    services.factory('articleSlugFactory', function($resource, $http) {
        return {
            getArticleSlug: function(slug) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles/${slug}`,
                });
            },
            getCommentsArticle: function(slug) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/articles/${slug}/comments`,
                });
            },

        };
    });
    services.factory('AuthenticationService', function($resource, $http, $rootScope, $cookies) {
        return {
            login: function(email, password) {
                var url = `${baseUrl}/users/login`;
                var data = {
                    user: {
                        "email": email,
                        "password": password
                    }
                };
                $http.post(url, data)
                    .then(function successCallback(response) {
                        var authdata = response.data.user.token;
                        $rootScope.globals = {
                            currentUser: {
                                email: email,
                                authdata: authdata
                            }
                        };
                        var cookieExp = new Date();
                        cookieExp.setDate(cookieExp.getDate() + 7);
                        $cookies.putObject('User', $rootScope.globals, { expires: cookieExp });
                    }, function errorCallback(err) {
                        // console.log(err);
                    });
            },
            logOut: function() {
                $rootScope.globals = {};
                $cookies.remove('User');
            }
        };
    });
})();