(() => {
    angular.module('myFeed').controller('sinh_setting', function($scope, $http, $window, $state, common_services_userinfo, lam_accountpage_services) {

        //****************************set token and username************************** */
        common_services_userinfo.setToken($window.localStorage.token);
        common_services_userinfo.setUsername($window.localStorage.username);
        common_services_userinfo.setEmail($window.localStorage.email);
        // console.log($window.localStorage);
        //****************************profile************************** */
        $scope.passW = $window.localStorage.pw;
        lam_accountpage_services.getProfile(common_services_userinfo.getUsername(), common_services_userinfo.getToken()).$promise.then(data => {
            $scope.urlPr = data.profile.image;
            $scope.yourName = data.profile.username;
            $scope.bio = data.profile.bio;
            $scope.email = common_services_userinfo.getEmail();
        });
        $scope.logout = () => {
            localStorage.clear();
            $scope.$emit('toggleMenu');
            $state.go("signIn");
        }
        $scope.showErr = false;
        $scope.updateSettings = function() {
            if ($scope.passW.length < 8) {
                $scope.showErr = true;
                $scope.mes = 'password is too short (minimum is 8 characters)'
            } else {
                let req = {
                    "user": {
                        "image": $scope.urlPr,
                        'username1': $scope.yourName,
                        "bio": $scope.bio,
                        "email": $scope.email,
                        'password': $scope.passW,
                    }
                }
                let token = $window.localStorage.token;
                $http({
                    method: 'PUT',
                    url: 'https://conduit.productionready.io/api/user',
                    data: req,
                    headers: {
                        authorization: `Token ${token}`,
                        'content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    console.log(response);
                    $state.go(`lam_accountpage`, { username: $scope.yourName });
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        }
    })
})()