angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
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
  function($scope, $rootScope, $ionicLoading, UserRecipeListService){
  
  $scope.recipeResults = UserRecipeListService.getSortedRecipes();
  $ionicLoading.hide();

  /* Select recipe function
  $scope.selectRecipe = function(selectedRecipe){

  };
  */
})

.controller('RecipeCtrl', function($scope, $stateParams, UserRecipeListService) {

  console.log('RecipeCtrl');
});
