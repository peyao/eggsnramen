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

.controller('IngredientsCtrl', function($scope){
  
  $scope.ingredients = ingredientList;
})

.controller('IngredientsResultsCtrl', function($scope){
  
  $scope.recipeResults = recipes;
  
  $scope.getResults = function(ingredientsArr){
    
    // Example: ingredientsArr = [ 'eggs', 'ramen' ]
    
    // ALGORITHM
    // ---------
    // First find a recipe that uses the FIRST ingredient, then increment the priority.
    // On that same recipe, use our next ingredientsArr element and see if it matches
    // the recipe's other 'required_items' array. Every element that matches will
    // increment the priority. When this recipe has finished assigning priority,
    // we look for another recipe that has the first element of our ingredientsArr,
    // and repeat.
    
  }
});

// Temporary ingredients database
var ingredientList = [{
  
  name: 'egg', // don't use plural?
  rarity: 0, // rarity goes from 0-2 (0 most common; 1 medium; 2 rare)
  description: 'something a chicken lays', // limit to 7 words MAX! won't fit screen!
  used_with: ['ramen', 'sandwich bread']
  
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
  optional_items: [
    'lettuce'
  ],
  
  // if you have to use imgur links, you can grab smaller versions by appending
  // 's'mall, 't'humbnail, 'm'edium
  // ex: http://i.imgur.com/bpLKCav.jpg
  //      we want the thumbnail, so
  // http://i.imgur.com/bpLKCavt.jpg
  //      notice the 't'?
  image_original: "http://i.imgur.com/bpLKCav.jpg",
  image_thumb: "http://i.imgur.com/bpLKCavt.jpg",
  image_medium: "http://i.imgur.com/bpLKCavm.jpg",
  
}, {
  
  name: 'recipe2',
  description: 'lorem ipsum blah',
  difficulty: '1',
  
  required_items: [],
  optional_items: [],
  
  image_original: "http://i.imgur.com/bpLKCav.jpg",
  image_thumb: "http://i.imgur.com/bpLKCavt.jpg",
  image_medium: "http://i.imgur.com/bpLKCavm.jpg",
}];