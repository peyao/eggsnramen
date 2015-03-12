var servicesModule = angular.module('starter.services', []);

servicesModule.factory('RecipeService', function($http, $q, $timeout) {

  return {

    getRecipe: function(recipeName, callback) {
      $http.get('/api/recipe/' + recipeName, { recipeName: recipeName })
        .success(function(data) {
          callback(data);
        })
        .error(function(status) {
          callback(null);
        });
    },

    getPopular: function(callback) {
      $http.get('/api/popular')
        .success(function(data) {
          callback(data);
        })
        .error(function(status) {
          callback(null);
        });
    },

    incrementRecipeUse: function(recipeName) {
      $http.put('/api/recipe/' + recipeName);
    }
  };
});

servicesModule.factory('FollowService', function($http, $q, $timeout) {
  // Might use a resource here that returns a JSON array

  var followers = [];
  var following = [];
  var userList = [];

  return {
    
    // Need to pass in User object and simply get the JSON array.
    followSync: function(username, callback) {
      $http.get('/api/user/' + username + '/follow')
        .success(function(data, status) {

          followers = [];
          following = [];
          for ( var i = 0; i < userList.length; ++i ) {
            for ( var j = 0; j < data.following.length; ++j ) {
              if ( userList[i].username === data.following[j] )
                  following.push(userList[i]);
              if ( userList[i].username === data.followers[j] )
                  followers.push(userList[i]);
            }
          }
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    },

    getFollowers: function() {
      return followers;
    },

    getFollowing: function() {
      return following;
    },
    
    getUserList: function(callback) {
      $http.get('/api/user/searchlist').
        success(function(data, status) {

          // Sort usernames
          userList = data.sort(function(a,b) {

            var userA = a.username.toLowerCase();
            var userB = b.username.toLowerCase();

            if (userA > userB) return 1;
            if (userA < userB) return -1;
            return 0;
          });

          callback(userList);
        }).
        error(function(data, status) {
          callback(data);
        });
    },

    // TODO
    getSpecificFriend: function(friendUsername) {

    },


    searchList: function(searchFilter) {
      var deferred = $q.defer();

      var matches = userList.filter(function(userResult) {
        if (userResult.username.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) {
          return true;
        }
      });

      $timeout(function() {
        deferred.resolve(matches);
      }, 100);

      return deferred.promise;
    },

    addFollow: function(username, followUsername, callback) {
      $http.put('/api/user/' + username, {followUsername: followUsername})
        .success(function(status) {
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    }

  };
});

servicesModule.factory('UserSessionService', function($http){

  var user = {};

  return {

    // OUTPUT: Runs callback with user data if user is logged in, NULL otherwise
    checkLoggedIn: function(callback) {
      $http.get('/api/user').
        success(function(data, status, headers, config) {
          if (typeof data.username !== 'undefined') {
            user = data;
            callback(data);
          }
          else {
            callback(null);
          }
        });
    },

    getUserName: function() {
      return user.username;
    },

    getUserLevel: function() {
      return user.level;
    },

    getUserFavorites: function() {
      return user.favorites;
    },

    getUserObject: function() {
      return user;
    },

    // OUTPUT: Runs callback with TRUE if login succeeds, FALSE otherwise
    logIn: function(username, password, callback) {
      $http.post('/api/user/login', {username: username, password: password}).
        success(function(data, status) {
          user = data; // Set our local variable
          callback(true);
        }).
        error(function(data, status) {
          callback(false);
        });
    },

    logOut: function(callback) {
      $http.post('/api/user/logout')
      .success(function(status) {
          callback(true);
        });
    },

    register: function(username, email, password, cookingLevel, callback) {
      $http.post('/api/user', {username: username, email: email, password: password, cookingLevel: cookingLevel})
      .success(function(data, status) {
          callback(data);
        });
    },

    checkPassword: function(username, password, callback) {
      $http.post('/api/user/passwordcheck', {username: username, password: password})
        .success(function(status) {
          console.log("Current password matches.");
          callback(true);
        })
        .error(function(status) {
          console.log("checkPassword API return (status) : " + status);
          callback(false);
        });
    },

    changePassword: function(username, currentPass, newPass, callback) {
      $http.put('/api/user/' + username, {currentPass: currentPass, newPass: newPass})
        .success(function(status) {
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    },

    changeCookingLevel: function(username, newCookingLevel, callback) {
      $http.put('/api/user/' + username, {newCookingLevel: newCookingLevel})
        .success(function(status) {
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    },

    addRecipeToHistory: function(username, recipeName, callback) {
      $http.post('/api/user/recipehistory', { username: username, recipeName: recipeName })
        .success(function(status) {
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    },

    addRecipeToFavorites: function(username, recipeName, callback) {
      $http.post('/api/user/favorite', { username: username, recipeName: recipeName })
        .success(function(status) {
          callback(true);
        })
        .error(function(status) {
          callback(false);
        });
    }
  };
});

// Manages the User's Recipe List
servicesModule.factory('UserRecipeListService', function($http){

  // This collects `why` the recipe was selected (due to which ingredients)
  //var whyResultIngredientList = [];
  
  var sortedRecipes = [];
  //var currentRecipe = {}; // Recipe obj that user selected to cook

  // sortByKey
  // Input  :: String matching JSON key you want to sort.
  // Output :: Return 1 if objA["key"] > objB["key"], -1 if opposite, and 0 if equals.
  // Usage  :: yourArray.sort( sortByKey("key") );
  var sortByKey = function(key){
    
    return function(a,b) {

      if( a.key < b.key ) {
        return 1;
      }
      else if ( a.key > b.key ) {
        return -1;
      }
      return 0;
    };
  };

  return {

    getRecipesFromDB: function(callback) {
      // Grab Recipes from MongoDB
      $http.get('/api/recipes').success(function(data, status, headers, config){
        sortedRecipes = data;
        callback(sortedRecipes);
      });
    },

    // sortRecipes
    // Input  ::  checkedArray - An array of all the checked ingredients
    //            recipes - JSON object with all the available recipes
    // Output ::  bool true - found recipes
    //            bool false - no recipes found
    sortRecipes: function(checkedArray, recipes) {

      var matchedRecipes = []; // List recipes displayed in 'ingredients-results.html'

      // Makes a deep copy of recipes so we don't affect the original JSON file.
      var recipesCopy = [];
      recipesCopy = angular.copy(recipes);

      // For each ingredient in checkedArray...
      for ( i = 0; i < checkedArray.length; ++i ) {
        
        // For each recipe in recipesCopy...
        for ( j = 0; j < recipesCopy.length; ++j ) {
          
          // For each required_items in each recipe...
          for ( k = 0; k < recipesCopy[j].required_items.length; ++k ) {
            
            // Add keys to JSON object if they don't already exist
            if (!recipesCopy[j].hasOwnProperty('required_priority')) {
              recipesCopy[j].required_priority = 0;
              recipesCopy[j].optional_priority = 0;
              recipesCopy[j].total_priority = 0;

              // How many ingredients did the user check that's also in
              // this recipe's required_items array?
              recipesCopy[j].user_checked_required = 0;
            }
            
            if ( checkedArray[i].name === recipesCopy[j].required_items[k] ) {

              // increment priority by 2, because it is REQUIRED
              recipesCopy[j].required_priority = recipesCopy[j].required_priority + 2;
              recipesCopy[j].user_checked_required++;

            }
          }

          // For each optional_items in each recipe...
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

        if ( recipesCopy[i].required_priority > 0 &&
          recipesCopy[i].required_items.length === recipesCopy[i].user_checked_required ) {
          
          matchedRecipes.push(recipesCopy[i]);
        }
      }
      
      // Sort the recipe list matchedRecipes based on 'priority'
      sortedRecipes = matchedRecipes;//.sort(sortByKey('priority'));

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

      //console.log("clearSortedRecipes is called.");
      //sortedRecipes = [];
    },

    // Searches our recipes for one that matches the input name of the recipe,
    // then returns the recipe JSON object
    getSpecificRecipe: function(recipeName, callback){

      if (sortedRecipes.length === 0) {

        $http.get('/api/recipes').success(function(data, status, headers, config){

          sortedRecipes = data;
          console.log('recipelength: ' + sortedRecipes[0].name);

          for ( i = 0; i < sortedRecipes.length; ++i ) {
            if ( sortedRecipes[i].name === recipeName ) {
              callback(sortedRecipes[i]);
            }
          }
        });
      }
      else {
        for ( i = 0; i < sortedRecipes.length; ++i ) {
          if ( sortedRecipes[i].name === recipeName ) {
            callback(sortedRecipes[i]);
            return;
          }
        }
        console.log('Cannot find: ' + recipeName + ' in sortedRecipes with length ' + sortedRecipes.length);
        callback(null);
      }      
    },

    setCurrentRecipe: function(recipe){

      currentRecipe = recipe;
    },

    getCurrentRecipe: function(){

      return currentRecipe;
    },

    deleteCurrentRecipe: function(){

      currentRecipe = null;
    }
  };
});