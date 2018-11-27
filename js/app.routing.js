(function() {
    /**
     * myFeed Module
     *
     * Description
     */
    "use strict"
    angular.module('myFeed', [
        "ui.router",
        "ngResource"
    ]).config(function($stateProvider) {
        //**********code by lam**********
        //lam_accountpage
        $stateProvider.state({
            name: "lam_accountpage",
            url: "/lam_accountpage/:username",
            templateUrl: "template/lam_accountpage.html",
            controller: "lam_accountpage_controller"

        });
        //lam_article_detail
        $stateProvider.state({
            name: "lam_article_detail",
            url: "/article/:slug",
            templateUrl: "template/lam_article_detail.html",
            controller: "lam_article_detail_controller"
        });
        //**********code by truong**********
        //**********code by sinh**********
        //sinh1
        $stateProvider.state({
            name: 'signIn',
            url: '/signIn',
            templateUrl: '/template/sinh_sign_in.html',
            controller: 'sinh_controller_signIn',
        });
        $stateProvider.state({
            name: 'signUp',
            url: '/signUp',
            templateUrl: '/template/sinh_sign_up.html',
            controller: 'sinh_controller_signUp',
        });

    })
})();