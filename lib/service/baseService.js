/**
 * Created by ramon on 1/11/16.
 */
"use strict";

var _ = require('lodash');

var model = require('../model');

module.exports = BaseService;

function BaseService(modelName) {
  this.model = model[modelName];
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
  me.model.get(id, convertModelToPlainObj(callback));
};

/**
 * Auto find model global index to do query
 * @param {Object} options - options should contains model index hash key, or even with range key.
 * @param {Object} options.lastKey - TODO: is not supported, to get result after lastKey
 * @param {Number} options.limit
 * @param {Boolean} [options.isAscending = true]
 * @param {String} [options.op] - 'gte', 'gt', 'lte', 'lt', 'equals'
 * @param {function(err, result)} callback
 * @param {Error} callback.err
 * @param {Object} callback.result
 * @param {[Object]} callback.items
 * @param {Object} callback.lastKey
 */
proto.query = function(options, callback) {
  var me = this;
  var obj = new me.model();
  var usingIndex = null;

  // TODO: maybe different globalIndexes have same hashKey but different rangeKey
  _.forEach(obj.table.schema.globalIndexes, function(gi) {
    var hashKey = gi.hashKey;
    if (options.hasOwnProperty(hashKey)) {
      usingIndex = gi;
      return false;
    }
  });

  if (!usingIndex) {
    return callback(new Error('Cannot find GlobalIndex for this query'));
  }

  var q = me.model.query(options[usingIndex.hashKey]).usingIndex(usingIndex.name);

  q = options.isAscending === false ? q.descending() : q.ascending();

  if (options.limit) {
    q = q.limit(options.limit);
  }

  if (options.op && _.indexOf(['gte', 'gt', 'lte', 'lt', 'equals'], options.op) >= 0) {
    var value = options[usingIndex.rangeKey];
    if (!isNaN(parseInt(value))) {  // convert to number if necessary
      value = parseInt(value);
    }
    q = q.where(usingIndex.rangeKey)[options.op](value);
  }

  q.exec(function(err, data) {
    if (err) {
      return callback(err);
    }

    var result = {items: data.Items || [], lastKey: data.LastEvaluatedKey};
    return convertModelToPlainObj(callback)(err, result);
  });
};

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
    me.model.create(obj, convertModelToPlainObj(callback));
  } else {
    me.model.update(obj, convertModelToPlainObj(callback));
  }
};

/**
 * Remove object based on the id
 * @param {String} id
 * @param {function(err)} callback
 */
proto.remove = function(id, callback) {
  var me = this;
  me.model.destroy(id, callback);
};