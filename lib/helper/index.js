/*
 * Created by Ramon on 5/21/14 5:55 PM.
 * Copyright (c) 2014 Duck Duck Moose. All rights reserved.
 */

"use strict";

var path = require('path');
var fs = require('fs');
var util = require('util');

var _ = require('lodash');

exports.parseFormidableFiles = function(files) {
  var re = /.*(\[(\d+)\])/;       // now only supports 1 level array
  var newFiles = {};

  for (var fileField in files) {
    var result = fileField.match(re);
    if (result) {
      var newFieldName = fileField.replace(result[1], '');  // a[2] => ["a[2]", "[2]", "2"]
      var fieldIndex = parseInt(result[2]);
      if (!newFiles[newFieldName]) {
        newFiles[newFieldName] = [];
      }
      newFiles[newFieldName][fieldIndex] = files[fileField];
    } else {
      newFiles[fileField] = files[fileField];
    }
  }

  return newFiles;
};

exports.emptyFn = function() {
  if (!exports._emptyFn) {
    exports._emptyFn = function(){};
  }
  return exports._emptyFn;
};

/**
 * Auto load all js files under dir and copy all methods from js file into scope
 * @scope {Object}
 * @dir {String}
 * @fn {Function(lib, filePath)} if it's not null, call this function instead default function to copy methods
 */
var exportWrap = exports.exportWrap = function(scope, dir, fn) {
  if (!fn) {
    fn = function(lib, filePath) {
      for(var method in lib) {
        scope[method] = lib[method];
      }
    };
  }

  var files = fs.readdirSync(dir);
  files.forEach(function(file){
    if (path.extname(file) === '.js' && file !== 'index.js') {
      var filePath = path.resolve(path.join(dir, file));
      var lib = require(filePath);
      fn(lib, filePath);
    }
  });
};

exports.inherits = (function() {
  var _hasProp = {}.hasOwnProperty;
  return function(child, parent) {
    for (var key in parent) {
      if (_hasProp.call(parent, key))
        child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };
})();

/**
 *
 * @param req {HttpRequest} request object in expressjs
 * @param paramNames {[String] | String} if it's string, split it with ',' into array first; if it's array of string, return all corresponding params in this request as object. If it's null or undefined, return all parameters in request
 *  If paramNames "foo, bar", return {foo: req.param('foo'), bar: req.param('bar')};
 *  if paramNames ['foo', 'bar'], return {foo: req.param('foo'), bar: req.param('bar')};
 *  if paramNames ['foo:newFoo', 'bar'], return {newFoo: req.param('foo'), bar: req.param('bar')}
 * @returns {Object | String}
 */
exports.extractParamsFromReq = function(req, paramNames) {
  var result = {};

  if (!paramNames) {
    return _.extend(result, req.params, req.query, req.body);
  }

  if (isString(paramNames)) {
    paramNames = paramNames.split(',').map(function(name) { return name.trim(); });
  }

  paramNames.forEach(function(paramName) {
    var nameInReq = paramName;
    var nameInResult = paramName;
    var map = paramName.split(':');
    if (map.length >= 2) {
      nameInReq = map[0].trim();
      nameInResult = map[1].trim();
    }
    result[nameInResult] = req.param(nameInReq);
  });

  return result;
};