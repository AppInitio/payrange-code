/**
 * Created by ramon on 1/12/16.
 */

"use strict";

var async = require('async');
var _ = require('lodash');

var vogels = require('vogels');
var Joi = require('joi');


var Team = module.exports = vogels.define('Team', {
  tableName: 'Team',
  hashKey: 'id',
  timestamps: false,
  schema: Joi.object().keys({
    id: Joi.string(),           // same to name
    name: Joi.string()          // Manchester United
  }).unknown()
});

Team.before('create', function(data, next) {
  if (!data.name) {
    return next(new Error('name is required'), data);
  }

  Team.get(data.name, function(err, team) {
    if (err) {
      return next(err);
    }

    if (team) {
      return next(new Error('Team already exists'));
    }
  });

  data.id = data.name;
  next(null, data);
});