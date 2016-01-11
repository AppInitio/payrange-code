/**
 * Created by ramon on 3/4/15.
 */
"use strict";

var _ = require('lodash');

var httpStatus = require('../httpStatus');

exports.ERROR = require('./errors');

var UNKNOWN_ERROR = exports.ERROR.UNKNOWN_ERROR;

/**
 *
 * @param err {Object|Error} Object from errors.js or Error object
 * @param [status] {Number} value from httpStatus
 * @returns {Error}
 */
exports.create = function(err, status) {
  if (!err) {
    err = UNKNOWN_ERROR;
  } else if (_.isString(err)) {
    err = new Error(err);
  }
  var result = new Error(err.en || err.message);
  result.code = err.id || UNKNOWN_ERROR.id;
  result.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  return result;
};