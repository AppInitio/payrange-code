/**
 * Created by ramon on 1/11/16.
 */
"use strict";

var _ = require('lodash');

var model = require('../model');

module.exports = BaseService;

function BaseService(modelName) {
  this.service = model[modelName];
}

var proto = BaseService.prototype;

function convertModelToPlainObj(callback) {
  return function(err, result) {
    if (result) {
      if (result.hasOwnProperty('items')) {
        result.items = _.pluck(result.items, 'attrs');
      } else {
        result = result.attrs;
      }
    }
    callback(err, result);
  };
}

/**
 *
 * @param {String} id
 * @param {function(err, result)} callback
 * @param {Error} callback.err
 * @param {Object} callback.result
 */
proto.get = function(id, callback) {
  var me = this;
  me.service.get(id, convertModelToPlainObj(callback));
};

/**
 * Auto find model global index to do query
 * @param {Object} options - options should contains model index hash key, or even with range key.
 * @param {Object} options.lastKey
 * @param {String|Number} options.limit
 * @param {String|Boolean} options.isAscending
 * @param {function(err, result)} callback
 * @param {Error} callback.err
 * @param {Object} callback.result
 * @param {[Object]} callback.items
 * @param {Object} callback.lastKey
 */
proto.query = function(options, callback) {};

/**
 * Save or update obj depends if obj.id existing
 * @param {Object} obj
 * @param {String} [obj.id] - if not existing, create and save it; if existing, just update.
 * @param {function(err, result)} callback
 * @param {Error} callback.err
 * @param {Object} callback.result
 */
proto.upsert = function(obj, callback) {
  var me = this;
  if (!obj.id) {
    me.service.create(obj, convertModelToPlainObj(callback));
  } else {
    me.service.update(obj, convertModelToPlainObj(callback));
  }
};

/**
 * Remove object based on the id
 * @param {String} id
 * @param {function(err)} callback
 */
proto.remove = function(id, callback) {
  var me = this;
  me.service.destroy(id, callback);
};