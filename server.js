// Express (Web Server)
var express = require('express'),
app = express();

// Mongoose (MongoDB connection)
var mongoose = require('mongoose');
mongoose.connect('mongodb://eggsnramen:iloveeggs!@ds053688.mongolab.com:53688/heroku_app33525076');

// Passport (User authentication) & Other Middleware
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var passport = require('passport');
var authentication = require('./routes/authentication.js');
var userActions = require('./routes/user.js');
var recipeActions = require('./routes/recipe.js');
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME || 'app33525076@heroku.com', process.env.SENDGRID_PASSWORD || 'lijpylyv');

// Passport Uses
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'metroid prime', 
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Models & Routes
var ingredients = require('./routes/ingredients.js');
var recipes = require('./routes/recipes.js');
app.use('/api', ingredients);
app.use('/api', recipes);

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// API Routes
// GET /user : Returns the user, used to check if user is logged in, if they are return user.
app.get('/api/user', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
});

// PUT /user : Changes user data.
app.put('/api/user/:username', function(req, res) {
  if ( req.isAuthenticated() ) {

    // Change password
    if ( req.params.newPass ) {
      userActions.changePassword(req.params.username, req.body.currentPass, req.body.newPass, function(success) {
        if (success) {
          console.log("Change Password (SUCCESS) -> Sending 200");
          res.send(200);
        }
        else {
          console.log("Change Password (FAILED) -> Sending 500");
          res.send(500);
        }
      });
    }

    // Change cooking level
    else if ( req.body.newCookingLevel ) {
      userActions.changeCookingLevel(req.params.username, req.body.newCookingLevel, function(success) {
        if (success) {
          console.log("Change Cooking Level (SUCCESS) -> Sending 200");
          res.send(200);
        }
        else {
          console.log("Change Cooking Level (FAILED) -> Sending 500");
          res.send(500);
        }
      });
    }

    // Follow someone
    else if ( req.body.followUsername ) {
      userActions.addFollow(req.params.username, req.body.followUsername, function(success) {
        if (success) {
          console.log("Add Follower (SUCCESS) -> Sending 200");
          res.send(200);
        }
        else {
          console.log("Add Follower (FAILED) -> Sending 500");
          res.send(500);
        }
      });
    }
  }
  else {
    console.log("Sending 401");
    res.send(401);
  }
});

// POST /user : Registers user.
app.post('/api/user', function(req, res){
  userActions.register(req.body.username, req.body.email, req.body.password, req.body.cookingLevel, function(user){
    res.send(user);
  });
});

app.post('/api/user/login', passport.authenticate('local'), function(req, res){
	if (typeof req.user !== 'undefined')
		res.send(req.user);	
	else
		res.send(401);
});

app.post('/api/user/logout', function(req, res){
	req.logOut();
	res.send(200);
});

app.post('/api/user/passwordcheck', function(req, res) {
  if ( req.isAuthenticated() ) {
    userActions.checkPassword(req.body.username, req.body.password, function(status) {
      if (status) {
        console.log("Sending 200");
        res.send(200);
      }
      else {
        res.send(401);
      }
    });
  }
});

app.get('/api/user/searchlist', function(req, res){
	if ( req.isAuthenticated() ) {
		userActions.getUserList(function(user){
			res.send(user);
		});
	}
	else
		res.send(401); // Unauthorized
});

//
// GET : Returns the followers and following list, based on the username parameter.
//
app.get('/api/user/:username/follow', function(req, res) {
  userActions.getFollowLists(req.params.username, function(success, lists) {
    if (success) {
      res.send(lists);
    }
    else {
      res.send(500);
    }
  });
});

app.post('/api/user/recipehistory', function(req, res) {
  userActions.addToHistory(req.body.username, req.body.recipeName, function(success) {
    if (success) {
      res.send(200);
    }
    else {
      res.send(500);
    }
  });
});

app.post('/api/user/favorite', function(req, res) {
  userActions.addToFavorites(req.body.username, req.body.recipeName, function(success) {
    if (success) {
      res.send(200);
    }
    else {
      res.send(500);
    }
  });
});

app.get('/api/recipe/:recipeName', function(req, res) {
  recipeActions.getRecipe(req.params.recipeName, function(recipe) {
    if (recipe)
      res.send(recipe);
    else
      res.send(500);
  });
});

app.put('/api/recipe/:recipeName', function(req, res) {
  console.log('Received increment request for: ' + req.params.recipeName);
  recipeActions.incrementRecipeUse(req.params.recipeName, function(success) {
    if (success) {
      res.send(200);
    }
    else {
      res.send(500);
    }
  });
});

app.get('/api/popular', function(req, res) {
  recipeActions.getPopular(function(recipes) {
    if (recipes)
      res.send(recipes);
    else
      res.send(500);
  });
});

app.get('/api/image/:image', function(req, res) {

  res.sendfile('assets/user_profile_images/' + req.params.image);
});

app.get('/api/user/forgotpassword/:email', function(req, res) {

  sendgrid.send({
    to:       req.params.email,
    from:     'crew@eggsnramen.com',
    subject:  'eggsnramen Password Reset Link',
    text:     'Link to password reset.'
  }, function(err,json) {
    if (err) {
      return console.err(err);
    }
    console.log(json);
  });
  
});

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
