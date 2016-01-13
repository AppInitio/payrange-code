/**
 * Created by ramon on 10/30/15.
 */
"use strict";

var helper = require('../lib/helper');
var service = require('../lib/service');
var responsor = require('../lib/responsor');

module.exports = BaseRoute;

function BaseRoute(className) {
  this.className = className;
  this.service = service[className];
  if (!this.service) {
    throw new Error('Cannot find class in service module: ' + className);
  }
}

var proto = BaseRoute.prototype;

function _defaultCallback(req, res) {
  return function(err, result) {
    return responsor.response(err, result, req, res);
  };
}

function _notSupportCallback(req, res, err) {
  err = err || new Error('Request is not supported or miss some parameters');
  return responsor.response(err, null, req, res);
}

/**
 *
 * @param {Request} req - express Request
 * @param {Response} res - express Response
 * @param {function()} next - express next_layer to call next route handler, we don't use it
 * @param {function(err, result)} [done] - by default we use _defaultCallback to set response
 * @returns {*}
 */
proto.find = function(req, res, next, done) {
  var me = this;
  var id = req.param('id');
  done = done || _defaultCallback(req, res);

  if (id) {
    return me.service.get(id, done);
  }

  var options = helper.extractParamsFromReq(req);

  options.isAscending = options.isAscending === 'false' ? false : true;

  if (options.limit) {
    options.limit = parseInt(options.limit);
    if (isNaN(options.limit)) {
      delete options.limit;
    }
  }

  me.service.query(options, function(err, result) {
    return done(err, result);
  });
};

/**
 *
 * @param {Object} req
 * @param {Object} req._upsertObj - sub class can wrap object as _upsertObj
 * @param res
 * @returns {*}
 */
proto.upsert = function(req, res) {
  var upsertObj = req._upsertObj || req.param(_.camelCase(this.className)) || helper.extractParamsFromReq(req);
  var actionName = req.param('action') || 'upsert';

  if (!_.isEmpty(upsertObj)) {
    return this.service[actionName](upsertObj, _defaultCallback(req, res));
  }

  return _notSupportCallback(req, res);
};

proto.remove = function(req, res) {
  var id = req.param('id');
  if (id) {
    return this.service.remove(id, _defaultCallback(req, res));
  }

  return _notSupportCallback(req, res);
};