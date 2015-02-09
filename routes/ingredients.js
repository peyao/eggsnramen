var Ingredient = require('../models/ingredient.js');
var express = require('express');
var router = express.Router();

router.route('/ingredients').get(function(req,res) {
	
	Ingredient.find(function(err, ingredients) {
		if (err) {
			return res.send(err);
		}
		res.json(ingredients);
	});
});

module.exports = router;