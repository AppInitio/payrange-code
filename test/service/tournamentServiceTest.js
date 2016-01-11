/**
 * Created by ramon on 1/11/16.
 */
var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var TournamentService = require('../../lib/service').Tournament;

describe('TournamentService', function() {
  this.timeout(60 * 1000);

  var expectedTournamentId = '2015/2016';
  var obj = {
    name: 'English Premier League 2015/2016',
    startAt: 20150808,
    endAt: 20160515,
    teamCount: 20
  };

  it('upsert', function(done) {
    TournamentService.upsert(obj, function(err, tournament) {
      assert(tournament.id === expectedTournamentId);
      done(err);
    });
  });

  it('get', function(done) {
    TournamentService.get(expectedTournamentId, function(err, tournament) {
      assert(tournament);
      done(err);
    });
  });
});