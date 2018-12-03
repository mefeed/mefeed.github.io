(function() {
    /**
     * myFeed Module
     *
     * Description
     */
    "use strict"
    angular.module('myFeed', [
        "ui.router",
        "ngResource",
        'ngCookies',
    ]).config(function($urlRouterProvider, $stateProvider) {
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
        //lam_article_detail
        $stateProvider.state({
            name: "editArticle",
            url: "/editArticle/:slug",
            templateUrl: "template/editArticle.html",
            controller: "editArticleCtrl"
        });
        //**********code by truong**********
        $urlRouterProvider.otherwise('/home');
        $stateProvider.state({
            name: 'home',
            url: '/home',
            templateUrl: 'template/myFeed.truong.home_page.html',
            controller: 'myFeed.truong.controller.home'
        });
        $stateProvider.state({
            name: 'profile',
            url: '/@:username',
            templateUrl: 'template/myFeed.truong.profile_page.html',
            controller: 'myFeed.truong.controller.profile'
        });
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
        $stateProvider.state({
            name: 'setting',
            url: '/setting',
            templateUrl: '/template/sinh_setting.html',
            controller: 'sinh_setting',
        });
        $stateProvider.state({
            name: 'newArticle',
            url: '/newArticle',
            templateUrl: '/template/sinh_newArticle.html',
            controller: 'sinh_newArticle',
        });

    })
})();