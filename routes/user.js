var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var DEFAULT_IMAGE = "user_default.png";

module.exports = {

	register: function (username, email, password, cookingLevel, callback) {

		User.findOne({ 'username': username }, function(noExisting, user) {
			
			if (user === null) {

				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(password, salt, function(err, hash) {

						var newUser = new User({ username: username, email: email, password: hash, level: cookingLevel, image: DEFAULT_IMAGE });

						newUser.save(function(err, savedUser) {
							if (!err) {
								console.log('User successfully registered into DB');
							}
							else {
								console.log('Error registering user: ' + err);
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
	},

	getUserList: function (callback) {

		User.find({}, 'username email image', function(err, user) {
			
			callback(user);
		});
	},

  // UNTESTED
  getImagePath: function (username, callback) {
    User.findOne({ 'username': username }, function(err, user) {

      if (err)
        console.log("getImagePath err: " + err);
      return user.image;
    });
  },

  changePassword: function (username, currentPass, newPass, callback) {

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newPass, salt, function(err, hash) { 
        User.findOneAndUpdate(
          { 'username': username },
          { 'password': hash },
          { upsert: false },
          function(err, user) {
            if (err)
              callback(false);
            else
              callback(true);
          }
        );
      });
    });
  },

  changeCookingLevel: function (username, newCookingLevel, callback) {

    User.findOneAndUpdate({'username': username}, {'level': newCookingLevel}, function(err, user) {
      if (err)
        callback(false);
      else
        callback(true);
    });
  },

  checkPassword: function (username, password, callback) {
    User.findOne({ 'username': username }, function(err, user) {

      // Hash comparison
      bcrypt.compare(password, user.password, function(err, res){

        // Password failed...
        if (res === false) {
          console.log("bcrypt: Password did not match!");
          callback(false);
        }
        else {
          // Password matches!
          console.log("bcrypt: Password matches!");
          callback(true);
        }
      });
    });
  },

  addFollow: function (username, followUsername, callback) {
    // Update first user.
    User.findOneAndUpdate({'username': username}, 
      {$push: {'following': followUsername}}, 
      {safe: true, upsert: true}, 
      function(err, user) {
        if (err) {
          callback(false);
          return;
        }
      }
    );

    // Update second user.
    User.findOneAndUpdate({'username': followUsername}, 
      {$push: {'followers': username}}, 
      {safe: true, upsert: true}, 
      function(err, user) {
        if (err) {
          callback(false);
          return;
        }
        else
          callback(true);
      }
    );
  },

  getFollowLists: function (username, callback) {

    User.findOne({'username': username}, function(err, user) {
      if (err)
        callback(false, {});
      else
        callback(true, {'following': user.following, 'followers': user.followers});
    });
  },

  addToHistory: function (username, recipeName, callback) {
    User.findOneAndUpdate({'username': username}, 
      {$push: {'recipe_history': recipeName}}, 
      {safe: true, upsert: true}, 
      function(err, user) {
        if (err) {
          callback(false);
          return;
        }
        else
          callback(true);
      }
    );
  },

  addToFavorites: function (username, recipeName, callback) {
    User.findOneAndUpdate({'username': username}, 
      {$push: {'favorites': recipeName}}, 
      {safe: true, upsert: true}, 
      function(err, user) {
        if (err) {
          callback(false);
          return;
        }
        else
          callback(true);
      }
    );
  }

};