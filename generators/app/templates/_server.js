var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

var name = config.get('APP_NAME');
var port = config.get('PORT');
var templatesDir = config.get('TEMPLATES_DIR');
var app = express();
var server;

// Set up body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set up logging with Bunyan
app.use(require('express-bunyan-logger')());
app.use(require('express-bunyan-logger').errorLogger());

// Set up templating with Nunjucks
nunjucks.configure(templatesDir, {
	autoescape: true,
	express: app,
});

// set up route.  Best to use Routers in other files.
app.get('/', function helloWorld(req, res) {
	res.send('Hello World!');
});

// set up error handling for app
app.use(function errorHandler(err, req, res, next) {
	req.log.error(err);
	res.status(500).send(err.stack);
	next();
});

server = app.listen(port, function startServer() {
	var host = server.address().address;
	console.log(name + ' app listening at http://%s:%s', host, port);
});
