// Ionic Starter App
var fb = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova','starter.controllers', 'starter.services', "firebase"])
    .directive('hideTabs', function($rootScope) {
        return {
            restrict: 'A'

        };
    })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
      fb = new Firebase("https://burning-fire-921.firebaseio.com/");

      console.log("INIT:" + fb.getAuth());
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $urlRouterProvider.otherwise('/tab/login');

  $stateProvider
      .state("home", {
          url: "/home",
          templateUrl: "templates/home.html",
          controller: "HomeController"
      })
      .state("tab.login", {
          url: "/login",
          cache: true,
          views: {
              'tab-login': {
                  templateUrl: 'templates/login.html',
                  controller: 'LoginController'
              }
          }
      })
      .state("tab.secure", {
          url: "/secure",
          views: {
              'tab-secure': {
                  templateUrl: 'templates/secure.html',
                  controller: 'SecureController'
              }
          }
      })
  // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
  // Each tab has its own nav history stack:
  .state("foto", {
      url: "/foto",
      templateUrl: "templates/foto.html",
      controller: "FotoController"
  }).state("addfoto", {
      url: "/addfoto",
      templateUrl: "templates/adicionar-foto.html",
      controller: "imageController"
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.foto', {
      url: '/foto',
      views: {
          'tab-foto': {
              templateUrl: 'templates/tab-foto.html',
              controller: 'FotoCtrl'
          }
      }
  })
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback


});
