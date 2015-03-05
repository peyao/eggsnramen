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
var expressSession = require('express-session');
var passport = require('passport');
var authentication = require('./routes/authentication.js');
var userActions = require('./routes/user.js');

// Passport Uses
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
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
// app.get('/blah', routeHandler);
app.get('/api/user/loggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
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

app.post('/api/user/register', function(req, res){
	userActions.register(req.body.username, req.body.email, req.body.password, req.body.cookingLevel, function(user){
		res.send(user);
	});
});

app.get('/api/user/searchlist', function(req, res){

	console.log('GET @ /api/userlist; Returning a list of users...');

	// Check if user is logged in first.
	if ( req.isAuthenticated() ) {
		userActions.getUserList(function(user){
			res.send(user);
			//console.log("Users: %j", user);
		});
	}
	else
		res.send(401); // Unauthorized
});

app.post('/api/update/user/recipe-history', function(req, res) {

});

app.get('/api/image/:image', function(req, res) {

  res.sendfile('assets/user_profile_images/' + req.params.image);
  /*
  userActions.getImagePath(req.params.username, function(imagepath){
    console.log("Sending image: " + imagepath);
    res.sendfile(imagepath);
  });
*/
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
