// Express (Web Server)
var express = require('express'),
    app = express();

// Mongoose (MongoDB connection)
var mongoose = require('mongoose');
mongoose.connect('mongodb://eggsnramen:iloveeggs!@ds053688.mongolab.com:53688/heroku_app33525076');

// Passport (User authentication)
var passport = require('passport');

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

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
