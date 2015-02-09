var servicesModule = angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */

servicesModule.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  };
});

// Manages the User's Recipe List
servicesModule.factory('UserRecipeListService', function(){

  // This collects `why` the recipe was selected (due to which ingredients)
  //var whyResultIngredientList = [];
  
  var sortedRecipes = [];

  // sortByKey
  // Input  :: String matching JSON key you want to sort.
  // Output :: Return 1 if objA["key"] > objB["key"], -1 if opposite, and 0 if equals.
  // Usage  :: yourArray.sort( sortByKey("key") );
  var sortByKey = function(key){
    
    return function(a,b) {

      if( a[key] < b[key] ) {
        return 1;
      }

      else if ( a[key] > b[key] ) {
        return -1;
      }

      return 0;
    };
  };

  return {

    // sortRecipes
    // Input  ::  checkedArray - An array of all the checked ingredients
    //            recipes - JSON object with all the available recipes
    // Output ::  bool true - found recipes
    //            bool false - no recipes found
    sortRecipes: function(checkedArray, recipes) {

      // ALGORITHM
      // ---------
      // First find a recipe that uses the FIRST ingredient, then increment the priority.
      // On that same recipe, use our next ingredientsArr element and see if it matches
      // the recipe's other 'required_items' array. Every element that matches will
      // increment the priority. When this recipe has finished assigning priority,
      // we look for another recipe that has the first element of our ingredientsArr,
      // and repeat.

      var matchedRecipes = [];

      // Makes a deep copy of recipes so we don't affect the original JSON file.
      var recipesCopy = [];
      recipesCopy = angular.copy(recipes);

      for ( i = 0; i < checkedArray.length; ++i ) {
        
        for ( j = 0; j < recipesCopy.length; ++j ) {
          
          //$window.alert('Checking recipe: ' + recipes[j].name);
          
          // Check required_items
          for ( k = 0; k < recipesCopy[j].required_items.length; ++k ) {
            
            /*
            $window.alert('Match?: ' + '"' +  
                          recipes[j].required_items[k] + '" and "' + 
                          checkedArr[i].name + '"');
            */
            
            if ( checkedArray[i].name === recipesCopy[j].required_items[k] ) {

              //$window.alert('required_items: ' + recipes[j].required_items[k]);
              
              // increment priority by 2, because it is REQUIRED
              recipesCopy[j].required_priority = recipesCopy[j].required_priority + 2;
              //whyResultIngredientList.push(checkedArr[i].name); name will get added twice
            }
          }

          // Check optional_items
          for ( k = 0; k < recipesCopy[j].optional_items.length; ++k ) {

            if ( checkedArray[i].name === recipesCopy[j].optional_items[k] ) {

              // increment priority by 1, because it is OPTIONAL
              recipesCopy[j].optional_priority++;
            }
          }
        }
      }

      // We will collect all matched recipes if their priority was modified
      for ( i = 0; i < recipesCopy.length; ++i ) {

        recipesCopy[i].total_priority = recipesCopy[i].required_priority + 
                                        recipesCopy[i].optional_priority;

        if ( recipesCopy[i].required_priority > 0 ) {
          
          matchedRecipes.push(recipesCopy[i]);
        }
      }

      console.log("matchedRecipes.length: " + matchedRecipes.length);
      
      // Sort the recipe list matchedRecipes based on 'priority'
      sortedRecipes = matchedRecipes.sort(sortByKey('priority'));

      // Return whether or not we have found recipes
      if (matchedRecipes.length > 0) {
        
        return true; // Found recipes
      }
      else {
        return false; // Did not find recipes
      }
    },

    getSortedRecipes: function(){

      return sortedRecipes;
    },

    deleteSortedRecipes: function(){

      //delete deleteThis;
      console.log("clearSortedRecipes is called.");
      sortedRecipes = [];
    }

  };
});