var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	username:	{ type: String, required: true, unique: true },
	email: 		{ type: String, required: true },
	password: 	{ type: String, required: true },
	image: 		{ type: String, required: true },
	level: 		{ type: String, required: true},
	recipe_history: [{ type: String }],
	followers: 		[{ type: String, unique: true }],
	following: 		[{ type: String, unique: true }]
});

module.exports = mongoose.model('User', userSchema);
