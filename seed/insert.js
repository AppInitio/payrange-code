/**
 * Created by ramon on 1/12/16.
 */

"use strict";

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var async = require('async');

var services = require('../lib/service');
var TournamentService = services.Tournament;
var TeamService = services.Team;
var TeamStandingService = services.TeamStanding;
var GameService = services.Game;

var tournamentId = '2015/2016';
var YEAR_BEGIN = 2015;
var YEAR_END = YEAR_BEGIN + 1;

/***************** file utils *********************/
/**
 *
 * @param {String} fileName
 * @returns {[String]}
 */
function readFile(fileName) {
  var filePath = path.join(__dirname, '2015-16/' + fileName);
  return fs.readFileSync(filePath, 'utf8').split('\n');
}

function isIgnored(line) {
  if (!line) {
    return true;
  }

  var trimmedLine = line.trim();

  return !trimmedLine || trimmedLine[0] === '#';
}

/***************** insert data *********************/

/**
 *
 * @param {function(err)} callback
 */
function insertTournament(callback) {
  TournamentService.upsert({
    name: 'English Premier League 2015/2016',
    startAt: 20150808,
    endAt: 20160515,
    teamCount: 20
  }, function(err, tournament) {
    tournamentId = tournament && tournament.id;
    callback(err);
  });
}


function insertTeams(callback) {
  var teams = [];

  async.series([
    function loadData(cb) {
      var lines = readFile('1-premierleague.conf.txt');
      _.forEach(lines, function(line) {
        if (!isIgnored(line) && line[0] === '-') {
          var name = line.substr(1).trim();
          teams.push({name: name});
        }
      });
      cb();
    },

    function insert(cb) {
      async.eachSeries(teams, function(team, icb) {
        TeamService.upsert(team, icb);
      }, cb);
    }
  ], callback);
}

function insertStandings(callback) {
  var standings = [];

  async.series([
    function loadData(cb) {
      var lines = readFile('README.md');
      _.forEach(lines, function(line) {
        if (!isIgnored(line)) {
          var index = line.indexOf('.');
          line = line.substr(index + 1).trim();
          var parts = line.split(/\s+|:/);
          var name = parts[0];
          var countIndex = 1;
          for (var len = parts.length; countIndex < len; countIndex++) {
            if (isNaN(parseInt(parts[countIndex]))) {
              name += ' ' + parts[countIndex];
            } else {
              break;
            }
          }

          var properties = ['matchCount', 'homeWonCount', 'homeDrawnCount', 'homeLostCount', 'homeGoalForCount', 'homeGoalAgainstCount', 'awayWonCount', 'awayDrawnCount', 'awayLostCount', 'awaysGoalForCount', 'awayGoalAgainstCount'];
          var standing = {teamId: name, tournamentId: tournamentId};
          _.each(properties, function(p, index) {
            standing[p] = parseInt(parts[countIndex + index]);
          });
          standings.push(standing);
          console.log(standing);
        }
      });
      cb();
    },

    function insert(cb) {
      async.eachSeries(standings, function(team, icb) {
        TeamStandingService.upsert(team, icb);
      }, cb);
    }
  ], callback);
}

function insertGames(callback) {
  var games = [];

  async.series([
    function loadData(cb) {
      async.eachSeries(['1-premierleague-i.txt', '1-premierleague-ii.txt'], function(fileName, icb) {
        _parseGameFile(fileName, function(err, _games) {
          if (_games) {
            games = games.concat(_games);
          }
          icb(err);
        });
      }, cb);
    },

    function insert(cb) {
      async.eachLimit(games, 2, function(item, icb) {
        GameService.upsert(item, icb);
      }, cb);
    }
  ], callback);
}

/**
 *
 * @param {String} fileName
 * @param {function(err, games)} callback
 * @private
 */
function _parseGameFile(fileName, callback) {
  var games = [];

  var lines = readFile(fileName);
  var matchDay = 0;
  var startDate = null; // yyyyMMdd
  _.each(lines, function(line) {
    line = line.trim();
    if (isIgnored(line)) {
      return;
    }

    if (line.indexOf('Matchday') === 0) {
      matchDay = parseInt(line.replace('Matchday', ''));
      return;
    }

    if (line[0] === '[' && line[line.length - 1] === ']') {
      startDate = _parseDate(line.substr(1, line.length - 2));
      return;
    }

    var teams = line.split('-');
    var team1 = _parseTeamStr(teams[0], -1);
    var team2 = _parseTeamStr(teams[1], 0);
    var game = {
      tournamentId: tournamentId,
      startTime: startDate,
      matchDay: matchDay,
      team1Id: team1.name,
      team2Id: team2.name
    };
    if (team1.goal !== undefined) {
      game.team1GoalCount = team1.goal;
      game.team2GoalCount = team2.goal;
    }

    games.push(game);
  });

  callback(null, games);
}

/**
 *
 * @param {String} str - like 'Sat Aug/8'
 * @private {Number} - yyyyMMdd
 */
function _parseDate(str) {
  var weekDayAndDate = str.split(/\s+/);
  var monthAndDay = weekDayAndDate[1].split('/');
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  var month = _.indexOf(months, monthAndDay[0]);
  var day = parseInt(monthAndDay[1]);
  var year = month >= 7 ? YEAR_BEGIN : YEAR_END;
  return year * 10000 + (month + 1) * 100 + day;  // new Date(year, month, day);
}

/**
 *
 * @param {String} str - like 'Arsenal FC' or 'Arsenal FC   5' or '1  Southampton FC'
 * @param {Number} goalIndex - 0 means goal at begin, -1 means goal at end
 * @return {Object} team
 * {String} team.name
 * {Number} [team.goal]
 */
function _parseTeamStr(str, goalIndex) {
  str = str.trim();
  var parts = str.split(/\s+/);
  var goal = parseInt(goalIndex === -1 ? parts[parts.length - 1] : parts[0]);
  if (isNaN(goal)) {
    return {name: str};
  } else {
    return {name: str.replace('' + goal, '').trim(), goal: goal};
  }
}

(function main() {
  async.series([
    //insertTournament,
    //insertTeams,
    //insertStandings,
    insertGames,
  ], function(err) {
    console.log('Done >>>', err);
  });
})();