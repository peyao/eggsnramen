var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({

	name: 			String,
	description:	String,
	difficulty: 	Number,
	required_items: [{ type: String }],
	optional_items: [{ type: String }],
	total_priority: Number,
	required_priority: Number,
	optional_priority: Number,
	image: String,
	author: String
});

module.exports = mongoose.model('Recipe', recipeSchema);
