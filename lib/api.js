var fs = require('fs');
var path = require('path');
var request = require('request');


module.exports = function(app) {
	
	app.get('/', function(req, res) {
		res.render('layout.ejs');
	});

};

