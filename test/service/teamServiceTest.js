/**
 * Created by ramon on 1/11/16.
 */

var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var TeamService = require('../../lib/service').Team;

describe('TeamService', function() {
  this.timeout(60 * 1000);

  it('get', function(done) {
    var teamId = 'Manchester United';
    TeamService.get(teamId, function(err, team) {
      assert(team.id === teamId);
    });
  });

  it('create', function(done) {

  });
});