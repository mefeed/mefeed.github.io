(function() {
    let baseUrl = "https://conduit.productionready.io";
    angular.module('myFeed')
        .service('lam_accountpage_services', ['$http', '$resource', function($http, $resource) {

            //registration
            this.registration = ({ email: email, pw: password }) => ($resource(`${baseUrl}/api/users/login`, {}, {
                query: { method: 'POST' }
            })).query({ "user": { "email": email, "password": password } });

            // getProfile
            this.getProfile = (username, token) => ($resource(`${baseUrl}/api/profiles/:username`, {}, {
                query: {
                    method: 'GET',
                    params: { username },
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //get List Articles
            this.listArticles = (author, token, limit = 10, offset = 0) => ($resource(`${baseUrl}//api/articles?author=${author}&limit=${limit}&offset=${offset}`, {}, {
                query: {
                    method: "GET",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //get List Articles favorited
            this.listArticlesFavorited = (author, token, limit = 10, offset = 0) => ($resource(`${baseUrl}//api/articles?limit=${limit}&offset=${offset}&favorited=${author}`, {}, {
                query: {
                    method: "GET",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //Get Article
            this.getArticle = (slug) => ($resource(`${baseUrl}/api/articles/${slug}`, {}, {
                query: {
                    method: "GET"
                }
            })).query();

            //deleteArticle
            this.deleteArticle = (slug, token) => ($resource(`${baseUrl}/api/articles/${slug}`, {}, {
                query: {
                    method: "DELETE",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //updateArticle
            this.updateArticle = (slug, token) => ($resource(`${baseUrl}/api/articles/${slug}`, {}, {
                query: {
                    method: "PUT",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            }));

            //Favorite Article
            this.favoriteArticle = (slug, token) => ($resource(`${baseUrl}/api/articles/${slug}/favorite`, {}, {
                query: {
                    method: "POST",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //Un Favorite Article
            this.unfavoriteArticle = (slug, token) => ($resource(`${baseUrl}/api/articles/${slug}/favorite`, {}, {
                query: {
                    method: "DELETE",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //folow
            this.follow = (username, token) => ($resource(`${baseUrl}/api/profiles/${username}/follow`, {}, {
                query: {
                    method: "POST",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //unfolow
            this.unfollow = (username, token) => ($resource(`${baseUrl}/api/profiles/${username}/follow`, {}, {
                query: {
                    method: "DELETE",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

            //get comment
            this.getComment = (slug) => ($resource(`${baseUrl}/api/articles/${slug}/comments`, {}, {
                query: {
                    method: "GET"
                }
            })).query();

            //add comment
            this.addComment = (slug, body, token) => ($resource(`${baseUrl}/api/articles/${slug}/comments`, {}, {
                query: {
                    method: "POST",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query({ "comment": { "body": body } });

            //delete comment
            this.deleteComment = (slug, id, token) => ($resource(`${baseUrl}/api/articles/${slug}/comments/${id}`, {}, {
                query: {
                    method: "DELETE",
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }
            })).query();

        }])
})();