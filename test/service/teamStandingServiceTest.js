/**
 * Created by ramon on 1/11/16.
 */

var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var TeamStandingService = require('../../lib/service').TeamStanding;

describe('TeamStandingService', function() {
  this.timeout(60 * 1000);

  var tournamentId = '2015/2016';

  it('get/create/remove', function(done) {
    var teamName = 'Manchester United X';
    var teamId = tournamentId + '-' + teamName;

    async.series([
      function get1(cb) {
        TeamStandingService.get(teamId, function(err, team) {
          assert(!team);
          cb(err);
        });
      },

      function create(cb) {
        TeamStandingService.upsert({
          tournamentId: tournamentId,
          name: teamName
        }, function(err, team) {
          assert(team && team.id === teamId);
          cb(err);
        });
      },

      function get2(cb) {
        TeamStandingService.get(teamId, function(err, team) {
          assert(team);
          cb(err);
        });
      },

      function remove(cb) {
        TeamStandingService.remove(teamId, cb);
      },

      function get3(cb) {
        TeamStandingService.get(teamId, function(err, team) {
          assert(!team);
          cb(err);
        });
      }
    ], done);
  });

  it.only('query', function(done) {
    var tournamentId = '2015/2016';
    var standings = [{
      tournamentId: tournamentId,
      name: 'team1'
    }, {
      tournamentId: tournamentId,
      name: 'team2'
    }];

    var savedTeams = [];

    async.series([
      function setup(cb) {
        async.eachSeries(standings, function(team, icb) {
          TeamStandingService.upsert(team, icb);
        }, cb);
      },

      function query(cb) {
        TeamStandingService.query({tournamentId: tournamentId}, function(err, result) {
          savedTeams = result.items;
          assert(result.items.length === result.items.length);
          cb(err);
        });
      },

      function clear(cb) {
        async.eachSeries(savedTeams, function(team, icb) {
          TeamStandingService.remove(team.id, icb);
        }, cb);
      }
    ], done);
  });
});