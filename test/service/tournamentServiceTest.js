/**
 * Created by ramon on 1/11/16.
 */
var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var TournamentService = require('../../lib/service').Tournament;

describe('TournamentService', function() {
  this.timeout(60 * 1000);

  it.only('upsert', function(done) {
    var obj = {
      name: 'English Premier League 2015/2016',
      startAt: 20150808,
      endAt: 20160515,
      teamCount: 20
    };

    TournamentService.upsert(obj, function(err, tournament) {
      assert(tournament.id === '2015/2016');
      done(err);
    });
  });
});