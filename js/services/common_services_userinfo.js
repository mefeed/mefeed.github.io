(function() {
    "use strict";
    angular.module('myFeed')
        .service('common_services_userinfo', function() {
            this.user = {};
            this.pw = ""
            return {
                saveUser: (user, pw) => {
                    this.user = user;
                    this.pw = pw;
                },
                getUser: () => ({ user: this.user, pw: this.pw }),
                getEmailPW: () => ({ email: this.user.email, pw: this.pw }),
                getToken: () => this.user.token,
                getUsername: () => this.user.username
            }
        })
})();