var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var name = config.get('APP_NAME');
var port = config.get('DEFAULT_PORT');
var templatesDir = config.get('DEFAULT_TEMPLATES_DIR');
var app = express();
var server;
var nunjucksEnv;

// Set up body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set up logging with Bunyan
app.use(require('express-bunyan-logger')());
app.use(require('express-bunyan-logger').errorLogger());

// set up static path to bootstrap
app.use(express.static('./node_modules/bootstrap/dist/'));

// Set up templating with Nunjucks
nunjucksEnv = nunjucks.configure(templatesDir, {
  autoescape: true,
  express: app,
});

// set up route.  Best to use Routers in other files.
app.get('/', require('./lib/controllers/helloController'));

// set up error handling for app
app.use(function(err, req, res, next) {
  req.log.error(err);
  res.status(500).send(err.stack);
  next();
});

// start server
server = app.listen(port, function() {
  var host = server.address().address;
  console.log(name + ' app listening at http://%s:%s', host, port);
});
