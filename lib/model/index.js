/**
 * Created by ramon on 1/11/16.
 */

"use strict";

var path = require('path');

var config = require('config');
var vogels = require('vogels');

var helper = require('../helper');

vogels.AWS.config.update(config.aws);

helper.exportWrap(exports, __dirname, function(lib, filePath) {
  var fileName = path.basename(filePath, '.js');
  var className = fileName[0].toUpperCase() + fileName.substr(1);
  exports[className] = lib;
});