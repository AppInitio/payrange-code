/**
 * Created by ramon on 4/23/15.
 */

var _ = require('lodash');
var jwt = require('jsonwebtoken');

var password = require('./encrypt').password;
var error = require('../error');
var httpStatus = require('../httpStatus');

/**
 *
 * @param {Object|String} options - String is userId
 * @param {String} options.userId
 * @param {Number} [options.expiration=360] - in minutes, 0 means never expired
 * @param {function(err, sessionToken)} [callback]
 * @param {Error} callback.err
 * @param {String} callback.sessionToken
 */
exports.createSessionToken = function(options, callback) {
  if (_.isString(options)) {
    options = { userId: options };
  }

  var session = _.defaults({}, options);
  delete session.expiration;

  var token = jwt.sign(session, password, {
    expiresInMinutes: options.expiration || 360
  });

  if (callback) {
    callback(null, token);
  } else {
    return token;
  }
};

/**
 *
 * @param {String} sessionToken
 * @param {Object} options
 * @param {Boolean} options.ignoreExpiration
 * @param {function(err, decoded)} callback
 * @param {Error} callback.err - session is invalid or session is expired
 * @param {Object} callback.decoded - the decoded session token
 */
exports.verifySessionToken = function(sessionToken, options, callback) {
  // TODO: check expiration
  if (arguments.length === 2) {
    callback = options;
    options = {ignoreExpiration : true};
  }

  jwt.verify(sessionToken, password, options, function(err, decoded) {
    if (err && err instanceof jwt.TokenExpiredError) {
      err = error.create(error.ERROR.TOKEN_EXPIRED, httpStatus.UNAUTHORIZED);
    } else if (err && err instanceof jwt.JsonWebTokenError) {
      err = error.create(error.ERROR.TOKEN_INVALID, httpStatus.UNAUTHORIZED);
    }

    callback(err, decoded);
  });
};

exports.authorize = function(req, res, next) {
  var requestUrl = req.originalUrl || req.url;
  if (req.param(password) || !_isAuthenticationRequired(requestUrl)) {
    return next();
  }

  var sessionToken = req.param('sessionToken');
  if (!sessionToken && req.headers.authorization) {
    var bearer = req.headers.authorization.split(" ");  // Bear xxxxx
    sessionToken = bearer[1];
  }

  function unAuthorize(err) {
    next(error.create(err.message || err, httpStatus.UNAUTHORIZED));
  }

  if (!sessionToken) {
    return unAuthorize('No session token is found in request');
  }

  exports.verifySessionToken(sessionToken, function(err, decoded) {
    if (!err) {
      req.sessionToken = sessionToken;
      req.decodedSessionToken = decoded;
    }
    return err ? unAuthorize(err) : next();
  });
};

function _isAuthenticationRequired(url) {
  if (!url) {
    return false;
  }

  var urlRegistration = '/api/service/login';
  var urlEmailReceiveFromMailGun = '/api/service/email';
  url = url.toLowerCase();
  if (url.indexOf(urlRegistration) >= 0 || url.indexOf(urlEmailReceiveFromMailGun) >= 0) {
    return false;
  }

  return /\/api\/.*/.test(url);
}

exports.isSuperPasswordReq = function(req) {
  return req.decodedSessionToken && req.decodedSessionToken.isSuperPasswordUser;
};