// Express (Web Server)
var express = require('express'),
    app = express();

// Mongoose (MongoDB connection)
var mongoose = require('mongoose');
mongoose.connect('mongodb://eggsnramen:iloveeggs!@ds053688.mongolab.com:53688/heroku_app33525076');

// Passport (User authentication) & Other Middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var authentication = require('./routes/authentication.js');

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

// Passport LOGIN
/*
app.post('/login',
	passport.authenticate('local', 
		{ successRedirect: '/asdf', failureRedirect: '/fail', failureFlash: true })
);
*/


app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);
app.get('/loggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/login', passport.authenticate('local'), function(req, res){
	//res.send(req.user);
	res.send(200, { message: 'loggedIn'});
});

app.post('/logout', function(req, res){
	req.logOut();
	res.send(200);
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
