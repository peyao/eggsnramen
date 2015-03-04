var User = require('../models/user.js');

module.exports.getUserList = function (callback) {

	User.find({}, ['username', 'email', 'image'], function(err, user) {
		
		callback(user);
	});
};