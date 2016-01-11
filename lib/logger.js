/*
 * Created by Ramon on 5/21/14 3:06 PM.
 * Copyright (c) 2014 Duck Duck Moose. All rights reserved.
 */

var _ = require('lodash');
var bunyan = require('bunyan');
var config = require('config');

var loggers = {};
var streams = [{
  level: config.logger.level || 'debug',
  stream: process.stdout
}];

var createLogger = exports.createLogger = function(loggerName) {
  if (!loggers[loggerName]) {
    var logger = bunyan.createLogger({
      name: loggerName,
      streams: streams
    });
    loggers[loggerName] = logger;

    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(function(methodName) {
      var oldMethodName = methodName + '_old';
      logger[oldMethodName] = logger[methodName];
      logger[methodName] = function() {
        if (arguments[0] && typeof(arguments[0]) === 'object') {
          if (arguments[0].err && arguments[0].err instanceof Error) {
            arguments[0].err = bunyan.stdSerializers.err(arguments[0].err);
          } else {
            delete arguments[0].err; // err is special property, so we can easy to check the err on server log
          }
        }
        logger[oldMethodName].apply(logger, arguments);
      };
    });
  }
  return loggers[loggerName];
};

exports.logger = createLogger(config.app);

