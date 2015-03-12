var Recipe = require('../models/recipe.js');

module.exports = {

	getRecipe: function(recipeName, callback) {
		Recipe.findOne({name: recipeName}, function(err, recipe) {
      if (recipe) {
        callback(recipe);
      }
      else {
        callback(null);
      }
		});
	},

  incrementRecipeUse: function(recipeName, callback) {
    Recipe.findOneAndUpdate({ 'name': recipeName }, 
        { $inc: { 'times_used': 1 } }, 
        { multi: false },
        function(err, recipe) {
      if (err) {
        console.log("err incrementing: " + err);
        callback(false);
      }
      else {
        callback(true);
      }
    });
  },

  getPopular: function(callback) {
    console.log("in getPopular");
    Recipe.find({})
      .sort('-times_used')
      .limit(5)
      .exec(function(err, recipes) {
        if (recipes)
          callback(recipes);
        else {
          callback(null);
        }
      });
  }

};
