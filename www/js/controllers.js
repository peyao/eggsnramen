angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  // Testing MongoDB commands
  $scope.test = function() {

    var ingredient = new Ingredient({

      name: "test ingredient",
      rarity: 2,
      description: "this is a test!"
    });

    Ingredient.create(ingredient, function(err, ingredient){

      if (err) console.log(err);
      else console.log(ingredient);
    });
  };
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
.controller('IngredientsCtrl', function($scope, $state, UserRecipeListService, $ionicPopup){

  $scope.ingredients = ingredientList;
  
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

      // sortRecipes returns 'true' if recipes were found
      if ( !UserRecipeListService.sortRecipes(checkedList, recipes) ) {

        $ionicPopup.alert({

          title: 'Sorry, no recipes were found with your current selection of ingredients.<br>' +
                  '<br>Please try selecting some more ingredients!'
        });
      }

      else {

        // Redirect to the results
        $state.go('tab.ingredients-results');
      }
    }
  };
})

// Controller for 'tab-ingredients-results.html'
.controller('IngredientsResultsCtrl', function($scope, $rootScope, UserRecipeListService){
  
  $rootScope.recipeResults = UserRecipeListService.getSortedRecipes();
});



/*
// Temporary ingredients database
var ingredientList = [{
  
  name: 'egg', // don't use plural?
  rarity: 0, // rarity goes from 0-2 (0 most common; 1 medium; 2 rare)
  description: 'something a chicken lays', // limit to 7 words MAX! won't fit screen!
  
}, {

  name: 'ramen',
  rarity: 0,
  description: 'the instant kind'
}, {
 
  name: 'lettuce',
  rarity: 0,
  description: 'it was in your salad last night'
  
}, {
  
  name: 'tuna can',
  rarity: 1,
  description: 'careful with those edges'
  
}, {
 
  name: 'sandwich bread',
  rarity: 0,
  description: 'don\'t leave the crusts'
}];

// Temporary recipe database
var recipes = [{
  
  name: 'eggs n ramen',
  description: 'lorem ipsum blah',
  difficulty: '0', // use difficulty scale 0-2 (0 beginner; 1 intermediate; 2 hard)
  
  // these items are NECESSARY for the recipe to show up, name them EXACTLY
  required_items: [
    'ramen', 'eggs'
  ],
  
  // these may bump the recipe higher in results list
  // DO NOT DUPLICATE THESE WITH THE ITEMS IN required_items! Things will break!
  optional_items: [
    'lettuce'
  ],
  
  total_priority: 0,
  required_priority: 0,
  optional_priority: 0,
  
  // if you have to use imgur links, you can grab smaller versions by appending
  // 's'mall, 't'humbnail, 'm'edium
  // ex: http://i.imgur.com/bpLKCav.jpg
  //      we want the thumbnail, so
  // http://i.imgur.com/bpLKCavt.jpg
  //      notice the 't'?
  image_original: "http://i.imgur.com/bpLKCav.jpg",
  image_thumb: "http://i.imgur.com/bpLKCavt.jpg",
  image_medium: "http://i.imgur.com/bpLKCavm.jpg"
  
}, {
  
  name: 'recipe2',
  description: 'lorem ipsum blah',
  difficulty: '1',

  total_priority: 0,
  required_priority: 0,
  optional_priority: 0,
  
  required_items: [],
  optional_items: ['tuna can'],
  
  image_original: "http://i.imgur.com/bpLKCav.jpg",
  image_thumb: "http://i.imgur.com/bpLKCavt.jpg",
  image_medium: "http://i.imgur.com/bpLKCavm.jpg"
  
}];
*/

