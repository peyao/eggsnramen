// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-google-analytics', 'zingchart-angularjs'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, AnalyticsProvider) {

  // Analytics
  AnalyticsProvider.setAccount('UA-60212236-1');
  AnalyticsProvider.trackPages(true);
  AnalyticsProvider.trackUrlParams(true);
  AnalyticsProvider.useDisplayFeatures(true);
  AnalyticsProvider.useAnalytics(true);
  AnalyticsProvider.useEnhancedLinkAttribution(true);


  $httpProvider.defaults.transformRequest = function (data) {
    if ( data === undefined ) {
      return data;
    }
    return $.param(data);
  };
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // DASHBOARD
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    // FAVORITES PAGE
    .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-dash': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })
    
    // INGREDIENTS CHECKBOXES
    .state('tab.ingredients', {
      url: '/ingredients',
      views: {
        'tab-dash': {
          templateUrl: 'templates/ingredients.html',
          controller: 'IngredientsCtrl'
        }
      }
    })
  
    // INGREDIENTS RESULTS
    .state('tab.ingredients-results', {
      url: '/ingredients/results',
      views: {
        'tab-dash': {
          templateUrl: 'templates/ingredients-results.html',
          controller: 'IngredientsResultsCtrl'
        }
      }
    })

    // RECIPE PAGE
    .state('tab.recipe', {
      url: '/recipe/:name',
      views: {
        'tab-dash': {
          templateUrl: 'templates/recipe.html',
          controller: 'RecipeCtrl'
        }
      }
    })

    // RECIPE-DONE PAGE (FINISHED COOKING)
    .state('tab.recipe-done', {
      url: '/recipe/:name/done',
      views: {
        'tab-dash': {
          templateUrl: 'templates/recipe-done.html',
          controller: 'RecipeDoneCtrl'
        }
      }
    })

    .state('tab.follow', {
      url: '/follow',
      views: {
        'tab-follow': {
          templateUrl: 'templates/tab-follow.html',
          controller: 'FollowCtrl'
        }
      }
    })
    .state('tab.user-detail', {
      url: '/user/:userName',
      views: {
        'tab-follow': {
          templateUrl: 'templates/user-detail.html',
          controller: 'UserDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        },
        'tab-account-login': {
          templateUrl: 'templates/tab-account-login.html',
          controller: 'AccountLoginCtrl'
        }
      }
    })

    .state('tab.registration', {
      url: '/registration',
      views: {
        'tab-account-login':{
          templateUrl: 'templates/tab-account-registration.html',
          controller: 'AccountRegistrationCtrl'
        }
      }
    })

    .state('tab.change-password', {
      url: '/changepassword',
      views: {
        'tab-account': {
          templateUrl: 'templates/change-password.html',
          controller: 'ChangePasswordCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

.run(function(Analytics) {
  // In case you are relying on automatic page tracking, you need to inject Analytics
  // at least once in your application (for example in the main run() block)
});