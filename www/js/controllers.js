//$rootScope variables:
//  loggedIn : bool
//  accountView : string
//  tabName : string

// Helper functions
//  setTabLoginStatus($rootScope) : sets the tabs to match whether user is logged in

angular.module('starter.controllers', [])
.controller('TabCtrl', function($rootScope, $scope, UserSessionService){

  // Set the $rootScope variable to check if user is logged in
  if ( typeof $rootScope.loggedIn === 'undefined' )
    $rootScope.loggedIn = false;

  UserSessionService.checkLoggedIn(function(data){
    if (typeof data !== 'undefined')
      $rootScope.loggedIn = status;
  });

  console.log("TabCtrl loggedIn: " + $rootScope.loggedIn);

  setTabLoginStatus($rootScope);
})



.controller('DashCtrl', function($scope, $rootScope, UserSessionService, Analytics) {

  Analytics.trackPage('dashboard');

  UserSessionService.checkLoggedIn(function(user) {

    if (user !== null) {
      console.log('Dash: User has a session.');

      $scope.user = user;
      $scope.loggedIn = true;
      $rootScope.loggedIn = true;
      setTabLoginStatus($rootScope);
    }
  });
})

.controller('FriendsCtrl', function($scope, Friends, Analytics) {
  
  Analytics.trackPage('friends');

  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, Analytics) {
  
  Analytics.trackPage('friend-detail');

  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($rootScope, $scope, $state, $ionicPopup, $window, UserSessionService, Analytics) {

  Analytics.trackPage('account');

  // Sets the username on the account page, left of the Edit button
  $scope.user = UserSessionService.getUserObject();
  //$scope.user.name = UserSessionService.getUserName();
  
  //User logout
  $scope.logOut = function(){
    UserSessionService.logOut(function(status) {
      if (status) {
        console.log("Logout successful.");
        //$state.go('tab.dash', {}, {reload: true});
        $window.location.replace("/");
      }
      else {
        console.log("Logout failed.");
      }
    });
  };

})

// User Login
.controller('AccountLoginCtrl', function($rootScope, $scope, $state, $ionicPopup, $window, UserSessionService, Analytics) {

  Analytics.trackPage('login');

  $scope.login = function(credentials){
    UserSessionService.logIn(credentials.username, credentials.password, function(status){
      // Callback function
      if (status) {
        console.log("Login Successful!");

        // Maintains rootScope tab status of login
        $rootScope.accountView = 'tab-account';
        $rootScope.tabName = 'Account';

        //$state.go('tab.dash');
        $window.location.replace("/");
      }
      else {
        console.log("Login Failed!");
        $ionicPopup.alert({

          title: "We couldn't find a user with that username and password combination!<br><br>Please try again."
        });
      }
    });
  };

  $scope.forgotPassword = function(){};

  $scope.createAccount = function() {
    $state.go('tab.registration');
  };
})


.controller('AccountRegistrationCtrl', 
  function($rootScope, $scope, $state, $ionicPopup, $ionicViewService, $window, UserSessionService, Analytics) {

    Analytics.trackPage('registration');
  
  $scope.register = function(credentials, registerRedirect) {

    //console.log('cookingLevel selected: ' + credentials.cookingLevel);

    if ( credentials.password === credentials.verifyPassword )
      UserSessionService.register(credentials.username, credentials.email, credentials.password, credentials.cookingLevel, function(user){
        // Callback
        if (typeof user.err === 'undefined') {

          UserSessionService.logIn(credentials.username, credentials.password, function(status){
            var alertPopup = $ionicPopup.alert({
              title: "Registration successful!<br><br>You can change your cooking level any time in your Account settings."
            });

            alertPopup.then(function(res) {

              $window.location.replace("/");
            });
          });
        }

        else {
          $ionicPopup.alert({
            title: user.err
          });
        }
      });
  };

  // For the login button on this page only.
  $scope.goToLogin = function() {

    $rootScope.accountView = 'tab-account-login';
    $rootScope.tabName = 'Login';

    var backView = $ionicViewService.getBackView();
    backView.go();
  };
})

// Controller for 'tab-ingredients.html'
.controller('IngredientsCtrl', 
  function($scope, $state, $http, UserRecipeListService, $ionicPopup, $ionicLoading,
           $timeout, $rootScope, Analytics){

  Analytics.trackPage('ingredients-checkboxes');

  // Show loading screen
  $ionicLoading.show({
    delay: 50,
    noBackdrop: true
  });

  var recipes = []; // Temporary variable holding the recipes grabbed from DB

  // Grab Ingredients from MongoDB
  if (typeof $rootScope.ingredients == 'undefined' ) {
    $http.get('/api/ingredients').success(function(data, status, headers, config){
      $rootScope.ingredients = data;

      // Hide loading screen when loading is finished
      $ionicLoading.hide();
    });
  }
  else {
    $ionicLoading.hide();
  }

  // Grab Recipes from MongoDB
  $http.get('/api/recipes').success(function(data, status, headers, config){
    recipes = data;
  });
  
  $scope.addIngredients = function(checkedList){    

    // Check if user actually selected any ingredients
    if (checkedList.length === 0) {

      // If they haven't selected any ingredients, we have to alert them.
      $ionicPopup.alert({

        title: 'Select some ingredients first!',
      });
    }

    // If they have selected ingredients, we can proceed with gathering recipes
    else {

      UserRecipeListService.deleteSortedRecipes();

      $ionicLoading.show();
      // sortRecipes returns 'true' if recipes were found
      if ( !UserRecipeListService.sortRecipes(checkedList, recipes) ) {

        $ionicPopup.alert({

          title: 'Sorry, no recipes were found with your current selection of ingredients.<br>' +
                  '<br>Please try selecting some more ingredients!'
        });
        $ionicLoading.hide();
      }

      else {

        // Redirect to the results
        $state.go('tab.ingredients-results');
      }
    }
  };
})

// Controller for 'tab-ingredients-results.html'
.controller('IngredientsResultsCtrl', 
  function($scope, $state, $rootScope, $ionicLoading, UserRecipeListService, Analytics){

  Analytics.trackPage('ingredients-results');
  
  $scope.recipeResults = UserRecipeListService.getSortedRecipes();
  $ionicLoading.hide();
})

.controller('RecipeCtrl', function($scope, $state, $stateParams, UserRecipeListService, Analytics){

  $scope.recipe = UserRecipeListService.getSpecificRecipe($stateParams.name);

  Analytics.trackPage('Recipe Page (' + $scope.recipe.name + ")");

  // Sets a constant 'currentRecipe' so we can easily get recipe obj of what user is currenly using
  //UserRecipeListService.setCurrentRecipe($scope.recipe);

  // Called when user clicks 'Done>' button on nav-bar
  $scope.finishedCooking = function() {

    // Redirect
    $state.go('tab.recipe-done', { name: $scope.recipe.name });
  };
})

.controller('RecipeDoneCtrl', function($scope, $state, $stateParams, 
    $ionicViewService, UserRecipeListService, Analytics){

  Analytics.trackPage('finished-cooking');

  $scope.recipe = UserRecipeListService.getSpecificRecipe($stateParams.name);

  //Google Analytics
  Analytics.trackEvent('Finished cooking @ MAIN.', $scope.recipe.name);

  // User is done using the 'currentRecipe', so we can clear it
  //UserRecipeListService.deleteCurrentRecipe();

  $scope.goDash = function() {

    var history = $ionicViewService.getBackView();
    $ionicViewService.goToHistoryRoot('002');
  };

})

.directive('dynamicNavView', function($rootScope, $compile) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element, $attr, ctrl) {
      $element.html('<ion-nav-view name="' + $rootScope.accountView + '"></ion-nav-view>');
      $compile($element.contents())(scope);
    }
  };
});

//HELPER FUNCTIONS
var setTabLoginStatus = function($rootScope) {
  if ( $rootScope.loggedIn ) {
    
    $rootScope.accountView = 'tab-account';
    $rootScope.tabName = 'Account';
  }
  
  else {
    
    $rootScope.accountView = 'tab-account-login';
    $rootScope.tabName = 'Login';
  }
};

var loginCallback = function(status) {

  
};