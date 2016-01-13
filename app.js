"use strict";

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var config = require('config');
var logger = require('./lib/logger').logger;

var app = express();

app.disable('x-powered-by');

// Enable it so req.ip is the real ip from client
app.set('trust proxy', true);

app.use(favicon(path.join(__dirname, 'favicon.ico'), {}));

// enable cros and allow authorization header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Request-Source");
  next();
});

// parse multipart for file upload and post request from our client with curl lib
app.use(require('./lib/middleware/bodyParser'));

// log the request/response and time cost, after bodyParser to log all request parameters
app.use(require('./lib/middleware/requestTime'));

//app.use(require('./lib/security').authorize);

app.use('/api', require('./routes/api'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('API does not exist');
    err.status = 404;
    next(err);
});

var port = process.env.PORT || config.server.port;
var server = app.listen(port, function() {
  logger.debug('Express server listening on port ' + server.address().port);
});