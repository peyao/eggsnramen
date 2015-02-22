var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	//_id: 		Schema.ObjectId,
	username:	String,
	email: 		String,
	password: 	String,
	image: 		String,
	level: 		String 
});

module.exports = mongoose.model('User', userSchema);
