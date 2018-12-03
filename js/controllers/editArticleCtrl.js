(() => {
    angular.module("myFeed").controller("editArticleCtrl", editArticleCtrl);
    editArticleCtrl.$inject = ['$window', '$scope', '$stateParams', '$state', 'lam_accountpage_services', 'common_services_userinfo'];

    function editArticleCtrl($window, $scope, $stateParams, $state, lam_accountpage_services, common_services_userinfo) {
        const slug = $stateParams.slug;

        //****************************set token and username************************** */
        common_services_userinfo.setToken($window.localStorage.token);
        common_services_userinfo.setUsername($window.localStorage.username);

        //******************************get article************************************ */
        $scope.update = () => {
            let req = {
                "article": {
                    "title": $scope.title,
                    "description": $scope.des,
                    "body": $scope.body
                }
            };
            lam_accountpage_services.updateArticle(slug, common_services_userinfo.getToken()).query(req).$promise
                .then(() => {
                    $state.go("lam_article_detail", { slug: slug });
                });
        }
        lam_accountpage_services.getArticle(slug).$promise
            .then(data => {
                $scope.title = data.article.title;
                $scope.des = data.article.description;
                $scope.body = data.article.body;
            });
    }
})();