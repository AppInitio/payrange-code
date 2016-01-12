/**
 * Created by ramon on 1/10/16.
 */
"use strict";

var async = require('async');
var _ = require('lodash');

var vogels = require('vogels');
var Joi = require('joi');

var Game = module.exports = vogels.define('Game', {
  tableName: 'Game',
  hashKey: 'id',
  timestamps: true,
  schema: Joi.object().keys({
    id: vogels.types.uuid(),
    tournamentId: Joi.string(),
    startTime: Joi.number(),  // timestamp
    matchDay: Joi.number(),

    team1Id: Joi.string(),
    team1GoalCount: Joi.number(),

    team2Id: Joi.string(),
    team2GoalCount: Joi.number()
  }).unknown(),

  indexes: [{
    // return upcoming/past games
    hashKey: 'tournamentId', rangeKey: 'startTime', name: 'tournamentId-startTime-index', type: 'global'
  }]
});