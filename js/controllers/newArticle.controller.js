(() => {
    angular.module('myFeed').controller('sinh_newArticle', function($state, $window, $scope, $http, common_services_userinfo) {

        //****************************set token and username************************** */
        common_services_userinfo.setToken($window.localStorage.token);
        common_services_userinfo.setUsername($window.localStorage.username);
        $scope.showErr = false;
        $scope.arrTagList = new Set();
        $scope.act = function(e) {
            if (!$scope.arrTagList.has($scope.tagsAr)) {
                $scope.arrTagList.add($scope.tagsAr);
            }
            $scope.tagsAr = '';
            $scope.arrTagListr = [...$scope.arrTagList];
        }
        $scope.deleteTagName = function() {
            if ($scope.arrTagList.has(this.tagName)) {
                $scope.arrTagList.delete(this.tagName);
                $scope.arrTagListr = [...$scope.arrTagList];
            }

        };
        $scope.publishArticle = function() {
            $scope.showErr = true;
            let token = common_services_userinfo.getToken();
            let arrTagList = [...$scope.arrTagList];
            let data = {
                article: {
                    title: $scope.titleAr,
                    description: $scope.desAr,
                    body: $scope.contentAr,
                    tagList: arrTagList,
                }
            }
            $http({
                method: 'POST',
                url: 'https://conduit.productionready.io/api/articles',
                data: data,
                headers: {
                    authorization: `Token ${token}`,
                    'content-type': 'application/json'
                }
            }).then(function successCallback(data) {
                $scope.showErr = false;
                $state.go("lam_article_detail", { slug: data.data.article.slug });
            }, function errorCallback(response) {
                $scope.bodyEr = response.data.errors.body;
                $scope.descriptionEr = response.data.errors.description;
                $scope.titleEr = response.data.errors.title;
            });
        }
    })
})();