var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	username:	{ type: String, required: true, unique: true },
	email: 		String,
	password: 	String,
	image: 		String,
	level: 		String,
	friends: 		[{ type: String }],
	recipe_history: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
