(() => {
    angular.module('myFeed').controller('sinh_controller_signUp', function($scope, $http, $window, $state) {
        $scope.showErr = false;
        $scope.signUp = function() {
            let data = {
                "user": {
                    "username": $scope.name,
                    "email": $scope.email,
                    "password": $scope.password,
                }
            }
            $http({
                    method: 'POST',
                    url: 'https://conduit.productionready.io/api/users',
                    data: data,
                }).then(function successCallback(response) {
                    $window.localStorage.token = response.data.user.token;
                }, function errorCallback(response) {
                    $scope.showErr = true;
                    $scope.emailErr = response.data.errors.email;
                    $scope.passErr = response.data.errors.password;
                    $scope.usernameErr = response.data.errors.username;
                })
                .then(() => {
                    $state.go(`signIn`);
                })
        }
    })

})();