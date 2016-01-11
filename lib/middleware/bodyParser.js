/*
 * Created by Ramon on 5/21/14 4:10 PM.
 * Copyright (c) 2014 Duck Duck Moose. All rights reserved.
 */
"use strict";

var fs = require('fs');

var _ = require('lodash');
var formidable = require('formidable');

var logger = require('../logger').logger;

var _isFileUploadingEnabled = false;

module.exports = function(req, res, next) {
  // default upload dir is os.tmp, such as /tmp on linux or /var/folders on mac
  var form = new formidable.IncomingForm({
    keepExtensions: true
  });

  form.parse(req, function(err, fields, files) {
    if (err || (_.isEmpty(fields) && _.isEmpty(files))) {
      return next(err);
    }

    // Make file param can be accessed from req.body or req.param()
    req.body = req.body || {};

    if (!_isFileUploadingEnabled) {
      _.forEach(files, function(file) {
        fs.unlink(file.path, function(err) {
          if (err) {
            logger.error({err: err, file: file.path}, 'Fail to remove uploaded file');
          }
        });
      });
      files = {};
    }

    _.extend(req.body, _mergeFields(fields), files);

    next();
  });
};

function _mergeFields(fields) {
  var re = /\[(.*?)\]/g;
  var newFields = {};

  _.each(fields, function(fieldValue, fieldName) {
    var result = null;
    var targetField = newFields;
    var targetKey = fieldName;
    while((result = re.exec(fieldName)) !== null) {
      targetKey = result[1];
      var fieldPath = fieldName.substr(0, re.lastIndex).replace(result[0], '');
      targetField = _.get(newFields, fieldPath);
      if (_.isUndefined(targetField)) {
        targetField = {};
        if (_isNumericKey(targetKey)) {
          targetField = [];
          targetKey = parseInt(targetKey);
        }
        _.set(newFields, fieldPath, targetField);
      }
    }

    targetField[targetKey] = fieldValue;
  });

  return newFields;
}

function _isNumericKey(key) {
  var index = parseInt(key);
  return !isNaN(index) && index.toString() === key;
}
