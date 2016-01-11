/**
 * Created by ramon on 1/11/16.
 */
"use strict";

var _ = require('lodash');

var model = require('../model');
var BaseService = require('./baseService');

_.forEach(_.keys(model), function(modelName) {
  exports[modelName] = new BaseService(modelName);
});