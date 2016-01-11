/**
 * Created by ramon on 1/11/16.
 */

"use strict";

var vogels = require('vogels');
var config = require('config');
var _ = require('lodash');

var model = require('../lib/model');

var tables = {};
_.forEach(_.keys(model), function(tableName) {
  tables[tableName] = {readCapacity: 1, writeCapacity: 1};
});

vogels.createTables(tables, function (err) {
  if(err) {
    console.log('Error creating tables', err);
  } else {
    console.log('table are now created and active');
  }
});