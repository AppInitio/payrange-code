/**
 * Created by ramon on 1/10/16.
 */

"use strict";

var async = require('async');
var _ = require('lodash');

var vogels = require('vogels');
var Joi = require('joi');

var Tournament = module.exports = vogels.define('Tournament', {
  tableName: 'Tournament',
  hashKey: 'id',
  timestamps: true,
  schema: Joi.object().keys({
    id: Joi.string(),         // startYear/endYear
    name: Joi.string(),       // 'English Premier League 2015/16'
    startAt: Joi.number(),    // 20150808
    endAt: Joi.number(),      // 20160515
    teamCount: Joi.number()   // 20
  }).unknown()
});

Tournament.before('create', function(data, next) {
  if (!data.startAt || !data.endAt) {
    return next(new Error('startAt and endAt are required'), data);
  }

  data.id = data.startAt.toString().substr(0, 4) + '/' + data.endAt.toString().substr(0, 4);
  next(null, data);
});