/**
 * Created by ramon on 1/12/16.
 */

var assert = require('assert');
var async = require('async');
var _ = require('lodash');

var GameService = require('../../lib/service').Game;

describe('GameService', function() {
  this.timeout(60 * 1000);

  var tournamentId = '2015/2016';

  it.only('query', function(done) {
    var tournamentId = '2015/2016';
    var limit = 5;

    async.series([
      function queryFutureGames(cb) {
        GameService.query({tournamentId: tournamentId, startTime: 20160112, op: 'gte', limit: limit}, function(err, result) {
          assert(result.items.length === limit);
          assert(result.items[0].startTime >= 20160112);
          cb(err);
        });
      },

      function queryPastGames(cb) {
        GameService.query({tournamentId: tournamentId, startTime: 20160112, op: 'lt', limit: limit, isAscending: false}, function(err, result) {
          assert(result.items.length === limit);
          console.log(result);
          assert(result.items[0].startTime < 20160112);
          cb(err);
        });
      }
    ], done);
  });
});