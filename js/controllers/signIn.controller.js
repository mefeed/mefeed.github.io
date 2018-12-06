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
                    $window.localStorage.username = response.data.user.username;
                    $window.localStorage.email = $scope.email;
                    $window.localStorage.pw = $scope.password;
                    $scope.username = response.data.user.username;
                    $scope.usernameLogin = response.data.user.username;
                    common_services_userinfo.saveUser(response.data.user, $scope.password);
                }, function errorCallback(response) {
                    $scope.showErr = true;
                    $scope.Err = 'is invalid'
                })
                .then(() => {
                    if ($scope.Err === 'is invalid') {
                        console.log("fail");
                    } else {
                        $scope.$emit('toggleMenu');
                        $scope.$emit('updateAccount');
                        $state.go("home");
                    }
                })
        }


    })
})();