var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

process.env.NODE_ENV = process.env.NODE_ENV || 'devaelopment';

app.use(bodyParser.urlencoded({extended: true}));

if (process.env.NODE_ENV == 'development') {
	app.use('build/templates', express.static(__dirname + '/assets/templates'));
}
app.use('/build', express.static(__dirname + '/build'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/img', express.static(__dirname + '/assets/img'));

// contains calls from backend
require('./lib/api')(app);

// needed to identify angular templates from backend calls so angular .otherwise works
var routes = require('./lib/routes');

app.get('/build/templates/:filename', routes.templates);
app.use(routes.index);
