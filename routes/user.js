var bcrypt = require('bcrypt');
var User = require('../models/user.js');

module.exports = {

	register: function (username, email, password, cookingLevel, callback) {

		User.findOne({ 'username': username }, function(noExisting, user) {
			
			// if no user was returned, user would === null
			if (user === null) {

				console.log('password: ' + password);
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(password, salt, function(err, hash) {

						// Insert into DB here
						console.log('password hashed: ' + hash);
						
						var newUser = new User({ username: username, email: email, password: hash, level: cookingLevel });

						newUser.save(function(err, savedUser) {
							if (!err) {
								console.log('User successfully saved into DB');
							}
							else {
								console.log('Error saving user into DB: ' + err);
							}
							callback(savedUser);
						});
					});
				});
			}

			else {
				// Return some error to front end indicating we failed
				console.log('user ' + user + ' already exists! Registration failed.');
				var errUser = { err: 'That username is already in use.' };
				callback(errUser);
			}
		});
	},

	updateRecipeHistory: function(username, recipeName, callback) {
		User.findOneAndUpdate(
			{'username': username}, 
			{$push: {"recipe_history": recipeName}},
			{safe: true, upsert: true},
			function(err, user) {
				console.log("updateRecipeHistory - err: " + err);
			}
		);
	}
};