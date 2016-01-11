/**
 * Created by ramon on 1/11/16.
 */

var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var TeamService = require('../../lib/service').Team;

describe('TeamService', function() {
  this.timeout(60 * 1000);

  it.only('get/create/remove', function(done) {
    var teamName = 'Manchester United X';
    var tournamentId = '2015/2016';
    var teamId = tournamentId + '-' + teamName;

    async.series([
      function get1(cb) {
        TeamService.get(teamId, function(err, team) {
          assert(!team);
          cb(err);
        });
      },

      function create(cb) {
        TeamService.upsert({
          tournamentId: tournamentId,
          name: teamName
        }, function(err, team) {
          assert(team && team.id === teamId);
          cb(err);
        });
      },

      function get2(cb) {
        TeamService.get(teamId, function(err, team) {
          assert(team);
          cb(err);
        });
      },

      function remove(cb) {
        TeamService.remove(teamId, cb);
      },

      function get3(cb) {
        TeamService.get(teamId, function(err, team) {
          assert(!team);
          cb(err);
        });
      }
    ], done);
  });

  it('query', function(done) {

  });
});