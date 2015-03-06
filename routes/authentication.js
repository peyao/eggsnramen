var User = require('../models/user.js');
var bcrypt = require('bcrypt');
var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;

module.exports = passport.use(new LocalStrategy(
	function(username, password, done) {

		console.log("In authentication.js. " + username + ":" + password);
		User.findOne({ 'username': username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			// Hash comparison
			bcrypt.compare(password, user.password, function(err, res){

				// Password failed...
				if (res === false) {
					console.log("bcrypt: Password did not match!");
					user.err = "Incorrect password";
					return done(err, false, { message: 'Incorrect password.' });
				}

				// Password matches!
				console.log("bcrypt: Password matches!");
				return done(null, user);
			});
		});
	}
));

module.exports = passport.serializeUser(function(user, done) {
	done(null, user.username);
});

module.exports = passport.deserializeUser(function(username, done) {
	// Query DB
	User.findOne({'username': username}, function(err, user) {
		done(null, user);
	});
});

