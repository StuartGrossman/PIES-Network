(function() {
  'use strict';
  angular.module('app', ['ui.router'])
  .config(Config)
  // .config(function($mdThemingProvider) {
  //   $mdThemingProvider.theme('default')
  //   .primaryPalette('light-green')
  //   .accentPalette('grey');
  // });
  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function Config($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider.state('Home', {
      url: '/',
      templateUrl: '../../test.html'
    })
    .state('QuestionsFeed', {
      url: '/questionsFeed',
      templateUrl: 'templates/questions_feed.html',
      controller: 'CreateQuestionController',
      controllerAs: 'vm'
    })
    // .state('updateProfile', {
    //   url: '/updateProfile',
    //   templateUrl: 'templates/update_profile.html',
    //   controller: 'UserProfileController',
    //   controllerAs: 'vm'
    // })
    // .state('CreateQuestion', {
    //   url: '/createQ',
    //   templateUrl: 'templates/create_question.html',
    //   controller: 'CreateQuestionController',
    //   controllerAs: 'vm'
    // })
    // .state('ViewQuesiton', {
    //   url: '/Quesiton/:id',
    //   templateUrl: 'templates/question_detail.html',
    //   controller: 'QuestionAnwserController',
    //   controllerAs: 'vm'
    // })
    // .state('UserProfile', {
    //   url: '/UserProfile',
    //   templateUrl: 'templates/user_profile.html',
    //   controller: 'UserProfileController',
    //   controllerAs: 'vm'
    // })
    // .state('Message', {
    //   url: '/Messaging/:recipient',
    //   templateUrl: 'templates/messaging.html',
    //   controller: 'MessageController',
    //   controllerAs: 'msg'
    // })
    // .state('Settings', {
    //   url: '/settings/:id',
    //   templateUrl: 'templates/user_settings.html',
    //   controller: 'UserSettingsController',
    //   controllerAs: 'vm'
    // })
    // .state("EditAnswer", {
    //   url: '/edit/:ans_id/:ques_id',
    //   templateUrl: 'templates/edit_answer.html',
    //   controller: 'EditAnswerController',
    //   controllerAs: 'vm'
    // }).state('Rank', {
    //   url: '/rank/:id',
    //   templateUrl: 'templates/rank.html',
    //   controller: 'RankController',
    //   controllerAs: 'vm'
    // }).state('Dash', {
    //   url: '/dashboard',
    //   templateUrl: 'templates/dash.html',
    //   controller: 'DashController',
    //   controllerAs: 'vm'
    // }).state('Icuras', {
    //   url: '/icuras',
    //   templateUrl: 'templates/icuras.html',
    //   controller: 'IcurasController',
    //   controllerAs: 'vm'
    // })


      // }],
    //   controllerAs: "vm",
    // });

$urlRouterProvider.otherwise('/');
}
})();
