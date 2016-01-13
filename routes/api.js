/**
 * User: ramon
 * Date: 6/3/14 11:29 AM 
 */
"use strict";

var express = require('express');
var _ = require('lodash');

var helper = require('../lib/helper');
var BaseRoute = require('./baseRoute');
var responsor = require('../lib/responsor');
var error = require('../lib/error');

var router = module.exports = express.Router();

/**
 *
 * @param {[String]} classNames - if className is string, we will load corresponding file from dir "./api/"; if it's object like {name, auto}
 * @param {Boolean} [auto=false] - if true auto generate route
 */
function setupRouters(classNames, auto) {
  classNames.forEach(function(className) {
    setupRouter(className, auto);
  });
}

/**
 *
 * @param {String} className - format like 'Game'
 * @param {Boolean} [isAuto = false] - if true auto generate route class; else load route file
 */
function setupRouter(className, isAuto, permissionChecker) {
  var classRouter = null;
  var camelCaseName = _.camelCase(className);
  if (isAuto) {
    classRouter = createAutoRouter(className);
  } else {
    classRouter = require('./api/' + camelCaseName);
  }

  permissionChecker = permissionChecker || defaultPermissionChecker;
  var route = router.route('/' + camelCaseName + '/:id?');
  [{method: 'get', fn: 'find'}, {method: 'post', fn: 'upsert'}, {method: 'delete', fn: 'remove'}].forEach(function(pair) {
    if (classRouter[pair.fn]) {
      route[pair.method](function(req, res, next) {
        permissionChecker(req, {modelName: className, action: pair.fn}, function(err) {
          if (err) {
            return responsor.response(err, null, req, res);
          }
          classRouter[pair.fn](req, res, next);
        });
      });
    }
  });
}

/**
 *
 * @param {String} className
 * @returns {ClassRouter}
 */
function createAutoRouter(className) {
  var ClassRouter = function(className) {
    BaseRoute.call(this, className);
  };

  helper.inherits(ClassRouter, BaseRoute);
  return new ClassRouter(className);
}

// '/api/xxxxYyyy/:id?'
setupRouters(['Tournament', 'Game', 'TeamStanding', 'Team'], true);

/**
 *
 * @param {Request} req - to get permission token
 * @param {Object} options
 * @param {String} options.modelName
 * @param {String} options.action - 'get', 'upsert', 'remove'
 * @param {function(err)} callback - callback.err is not null if has no permission
 */
function defaultPermissionChecker(req, options, callback) {
  if (options.action === 'find') {
    return callback();
  }

  if (req.param('token') === 'admin') {
    return callback();
  }

  return callback(error.create(error.ERROR.PERMISSION_IS_REQUIRED));
}