(() => {
    angular.module("myFeed").controller("myFeedCtrl", myFeedCtrl);
    myFeedCtrl.$inject = ['$window', '$scope', '$stateParams', '$state', 'lam_accountpage_services', 'common_services_userinfo'];

    function myFeedCtrl($window, $scope, $stateParams, $state, lam_accountpage_services, common_services_userinfo) {
        //****************************set token and username************************** */
        common_services_userinfo.setToken($window.localStorage.token);
        common_services_userinfo.setUsername($window.localStorage.username);
        $state.go('home');
        console.log($window.localStorage.token, $scope.checkLogin);
        $scope.usernameLogin = common_services_userinfo.getUsername();
        if ($window.localStorage.token == undefined) {
            $scope.checkLogin = false;
        } else {
            $scope.checkLogin = true;
        }
        $scope.$on("toggleMenu", function() {
            $scope.checkLogin = !$scope.checkLogin;
            $state.go("home");
        });
        $scope.$on("updateAccount", function() {
            $scope.usernameLogin = common_services_userinfo.getUsername();
            $state.go("home");
        });
    }
})();