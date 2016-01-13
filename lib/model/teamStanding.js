/**
 * Created by ramon on 1/10/16.
 */

"use strict";

var async = require('async');
var _ = require('lodash');

var vogels = require('vogels');
var Joi = require('joi');


var TeamStanding = module.exports = vogels.define('TeamStanding', {
  tableName: 'TeamStanding',
  hashKey: 'id',
  timestamps: true,
  schema: Joi.object().keys({
    id: Joi.string(),           // tournamentId-name, like '2015/2016-Manchester United'
    tournamentId: Joi.string(), // 2015/2016
    teamId: Joi.string(),         // Manchester United
    matchCount: Joi.number(),

    homeWonCount: Joi.number(),
    homeDrawnCount: Joi.number(),
    homeLostCount: Joi.number(),
    homeGoalForCount: Joi.number(),
    homeGoalAgainstCount: Joi.number(),

    awayWonCount: Joi.number(),
    awayDrawnCount: Joi.number(),
    awayLostCount: Joi.number(),
    awayGoalForCount: Joi.number(),
    awayGoalAgainstCount: Joi.number()

    // calc properties
    //totalGoalForCount: homeGoalForCount + awayGoalForCount,
    //totalGoalAgainstCount: homeGoalAgainstCount + awayGoalAgainstCount,
    //totalGoalDiffCount: totalGoalForCount - totalGoalAgainstCount,
    //points: 3 * (homeWonCount + awayWonCount) + 1 * (homeDrawnCount + awayDrawnCount)
  }).unknown(),

  indexes: [{
    // list of standings/team for tournamentId
    hashKey: 'tournamentId', rangeKey: 'teamId', name: 'tournamentId-teamId-index', type: 'global'
  }, {
    // list of standings for Team
    hashKey: 'teamId', rangeKey: 'tournamentId', name: 'teamId-tournamentId-index', type: 'global'
  }]
});

TeamStanding.before('create', function(data, next) {
  if (!data.teamId || !data.tournamentId) {
    return next(new Error('teamId and tournamentId are required'), data);
  }

  data.id = data.tournamentId + '-' + data.teamId;
  next(null, data);
});