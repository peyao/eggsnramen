var User = require('../models/user.js');
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
			/*
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			*/
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

module.exports = passport.serializeUser(function(user, done) {
	done(null, user._id);
});

module.exports = passport.deserializeUser(function(_id, done) {
	// Query DB
	User.findById(_id, function(err, user) {
		done(null, user);
	});
});

/*
// Routes
var express = require('express');
var router = express.Router();

router.route('/users').get(function(req,res) {
	
	User.findOne({ 'username': 'crab' }, function(err, users) {
		if (err) {
			return res.send(err);
		}
		res.json(users);
	});
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ 'username': username }, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				res.json(user);
				return done(null, user);
			});
		}
	));
});
module.exports = router;
*/
// End routes





