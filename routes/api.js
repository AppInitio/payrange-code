/**
 * User: ramon
 * Date: 6/3/14 11:29 AM 
 */
"use strict";

var express = require('express');
var _ = require('lodash');

var helper = require('../lib/helper');
var BaseRoute = require('./baseRoute');

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
 * @param {String} className - format like 'AccountStatusHistory'
 * @param {Boolean} [isAuto = false] - if true auto generate route class; else load route file
 */
function setupRouter(className, isAuto) {
  var classRouter = null;
  var camelCaseName = _.camelCase(className);
  if (isAuto) {
    classRouter = createAutoRouter(className);
  } else {
    classRouter = require('./api/' + camelCaseName);
  }

  var route = router.route('/' + camelCaseName + '/:id?');
  [{method: 'get', fun: 'find'}, {method: 'post', fun: 'upsert'}, {method: 'delete', fun: 'remove'}].forEach(function(pair) {
    if (classRouter[pair.fun]) {
      route[pair.method](_.bind(classRouter[pair.fun], classRouter));
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
setupRouters(['Tournament', 'Game', 'Team'], true);