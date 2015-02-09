var Recipe = require('../models/recipe.js');
var express = require('express');
var router = express.Router();

router.route('/recipes').get(function(req,res) {
	
	Recipe.find(function(err, recipes) {
		if (err) {
			return res.send(err);
		}
		res.json(recipes);
	});
});

module.exports = router;