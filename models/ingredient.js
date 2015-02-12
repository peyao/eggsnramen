var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientSchema = new Schema({

	name: String,
	rarity: Number,
	description: String
});

module.exports = mongoose.model('Ingredient', ingredientSchema);