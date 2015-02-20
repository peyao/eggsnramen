angular.module('starter.controllers', [])
.controller('TabCtrl', function($rootScope, $scope, UserSessionService){

  // Set the $rootScope variable to check if user is logged in
  if ( typeof $rootScope.loggedIn === 'undefined' )
    $rootScope.loggedIn = false;

  UserSessionService.checkLoggedIn(function(status){
    $rootScope.loggedIn = status;
  });

  console.log("TabCtrl loggedIn: " + $rootScope.loggedIn);

  // Redirect if we are already logged in
  if ( $rootScope.loggedIn ) {
    
    $rootScope.accountView = 'tab-account';
    $rootScope.tabName = 'Account';
  }
  
  else {
    
    $rootScope.accountView = 'tab-account-login';
    $rootScope.tabName = 'Login';
  }

})

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($rootScope, $scope, $state, $ionicPopup, UserSessionService) {

  

  /*
  // If user is not logged in, redirect them to the state 'tab.account-login'
  if ( !$rootScope.loggedIn ) {
    $state.go('tab.account-login');
  }
  */

  console.log("AccountCtrl loggedIn: " + $rootScope.loggedIn);

  /*$scope.data = {
    activeLevel : 1
  };

  $setLevel( function() {
    $scope.data.activeLevel = 

  });*/
  
  //User logout
  $scope.logout = function(){

  };

})

// User Login
.controller('AccountLoginCtrl', function($rootScope, $scope, $state, $ionicPopup, UserSessionService) {

  $scope.login = function(credentials, loginRedirect){

    UserSessionService.logIn(credentials.username, credentials.password, function(status){

      // Callback function
      if (status) {
        console.log("Login Successful!");

        // Maintains rootScope tab status of login
        $rootScope.accountView = 'tab-account';
        $rootScope.tabName = 'Account';

        $state.go('tab.dash');
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
    console.log("Going to Create Account");
    $rootScope.accountView = 'tab-account-registration';
    $rootScope.tabName = 'Account';

    $state.go('tab.dash');
  };
})


.controller('AccountRegistrationCtrl', function($rootScope, $scope, $state, $ionicPopup, UserSessionService) {
  $scope.goToLogin = function() {
    console.log("Going to Login");
    $rootScope.accountView = 'tab-account-login';
    $rootScope.tabName = 'Login';

    $state.go('tab.dash');
  };
})

// Controller for 'tab-ingredients.html'
.controller('IngredientsCtrl', 
  function($scope, $state, $http, UserRecipeListService, $ionicPopup, $ionicLoading,
           $timeout, $rootScope){

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
  function($scope, $state, $rootScope, $ionicLoading, UserRecipeListService){
  
  $scope.recipeResults = UserRecipeListService.getSortedRecipes();
  $ionicLoading.hide();
})

.controller('RecipeCtrl', function($scope, $state, $stateParams, UserRecipeListService){

  $scope.recipe = UserRecipeListService.getSpecificRecipe($stateParams.name);

  // Sets a constant 'currentRecipe' so we can easily get recipe obj of what user is currenly using
  //UserRecipeListService.setCurrentRecipe($scope.recipe);

  // Called when user clicks 'Done>' button on nav-bar
  $scope.finishedCooking = function() {

    // Redirect
    $state.go('tab.recipe-done', { name: $scope.recipe.name });
  };
})

.controller('RecipeDoneCtrl', function($scope, $state, $stateParams, $ionicViewService, UserRecipeListService){

  $scope.recipe = UserRecipeListService.getSpecificRecipe($stateParams.name);
  console.log($scope.recipe.name);

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
