var logger = require('./lib/logger');
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var expressBunyanLogger = require('express-bunyan-logger');
var routes = require('./lib/routes');
var _ = require('lodash');
var assert = require('assert');
var app = express();
var server;
var nunjucksEnv;

// Set up body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set up logging with Bunyan
app.use(expressBunyanLogger());
app.use(expressBunyanLogger.errorLogger());

// set up static path to bootstrap
app.use(express.static('./node_modules/bootstrap/dist/'));

// Set up templating with Nunjucks
nunjucksEnv = nunjucks.configure(config.DEFAULT_TEMPLATES_DIR, {
  autoescape: true,
  express: app
});

_.forOwn(routes, function(handler, path) {
  assert(typeof handler === 'function', 'All handlers must be functions.');
  app.use(path, handler);
});

// set up error handling for app
app.use(function(err, req, res, next) {
  req.log.error(err);
  res.status(500).send(err.stack);
  next();
});

// start server
server = app.listen(config.DEFAULT_PORT, function() {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('%s application listening at http://%s:%s ', config.APP_NAME, host, port);
});
