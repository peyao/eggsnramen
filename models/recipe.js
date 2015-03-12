var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({

	name: 			String,
	description:	String,
	difficulty: 	Number,
	required_items: [{ type: String }],
	optional_items: [{ type: String }],
	image: String,
	author: String,
	times_used: Number
});

module.exports = mongoose.model('Recipe', recipeSchema);
