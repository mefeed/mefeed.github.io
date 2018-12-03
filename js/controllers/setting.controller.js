(() => {
    angular.module('myFeed').controller('sinh_setting', function($scope, $http, $window, $state, common_services_userinfo, lam_accountpage_services) {

        //****************************set token and username************************** */
        common_services_userinfo.setToken($window.localStorage.token);
        common_services_userinfo.setUsername($window.localStorage.username);
        common_services_userinfo.setEmail($window.localStorage.email);

        //****************************profile************************** */
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
            console.log('aaaa')
            if ($scope.passW.length < 8) {
                $scope.showErr = true;
                $scope.mes = 'password is too short (minimum is 8 characters)'
            } else {
                let data = {
                    "user": {
                        "image": $scope.urlPr,
                        'username1': $scope.yourName,
                        "bio": $scope.bio,
                        "email": $scope.email,
                        'password': $scope.passW,
                    }
                }
                $http({
                    method: 'PUT',
                    url: 'https://conduit.productionready.io/api/user',
                    data: data,
                }).then(function successCallback(response) {
                    console.log('succ')
                    console.log(response)
                }, function errorCallback(response) {
                    console.log(response)
                });
            }
        }
    })
})()