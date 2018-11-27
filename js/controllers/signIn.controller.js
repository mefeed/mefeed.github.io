(() => {
    "use strict"
    angular.module('myFeed').controller('sinh_controller_signIn', function($scope, $http, $window, $state, common_services_userinfo) {
        $scope.signIn = function() {
            let data = {
                "user": {
                    "email": $scope.email,
                    "password": $scope.password,
                }
            }

            $http({
                method: 'POST',
                url: 'https://conduit.productionready.io/api/users/login',
                data: data,
            }).then(function successCallback(response) {
                $window.localStorage.token = response.data.user.token;
                //lam 1 in merger 1
                $scope.username = response.data.user.username;
                common_services_userinfo.saveUser(response.data.user, $scope.password);
                //end lam 1 in merger 1
            }, function errorCallback(response) {
                $scope.showErr = true;
                $scope.Err = 'is invalid'
            }).then(() => {
                $state.go(`lam_accountpage`, { username: $scope.username });
            })


        }
    })
})();