(() => {
    angular.module('myFeed').controller('sinh_controller_signUp', function($scope, $http, $window, $state) {
        $scope.showErr = false;

        $scope.changeMail = function() {
            $scope.showErr = false;

        }


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
                    console.log(response);
                    $window.localStorage.token = response.data.user.token;
                    $window.localStorage.username = response.data.user.username;
                    $window.localStorage.email = response.data.user.email;
                    console.log(response.data.user.token);
                    $scope.$emit("toggleMenu");
                    $state.go(`home`);
                }, function errorCallback(response) {
                    console.log('loi')
                    $scope.showErr = true;
                    $scope.emailErr = response.data.errors.email;
                    $scope.passErr = response.data.errors.password;
                    $scope.usernameErr = response.data.errors.username;
                })
                // .then(() => {
                //     $state.go(`signIn`);
                // })
        }
    })

})();