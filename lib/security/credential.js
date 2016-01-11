/**
 * Created by ramon on 6/12/15.
 */

var async = require('async');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var generatePassword = require('password-generator');

var helper = require('../helper');
var encrypt = require('./encrypt');
var logger = require('../logger').logger;
var error = require('../error');

var PASSWORD_MIN_LENGTH = 8;

/**
 *
 * @param {String} [clearPassword] - if it's empty, create a random clearPassword
 * @param {function(err, encryptPassword)} callback
 * @param {Error} callback.err
 */
exports.createPassword = function(clearPassword, callback) {
  if (arguments.length === 1) {
    callback = arguments[0];
    clearPassword = null;
  }

  if (!clearPassword) {
    clearPassword = generatePassword(PASSWORD_MIN_LENGTH  * 2, false);
  }

  var invalidPasswordError = _validatePassword(clearPassword);
  if (invalidPasswordError) {
    return callback(invalidPasswordError);
  }

  // 4 is best performance number after simple test, default 10 needs 80ms, <=4 needs 2ms.
  bcrypt.hash(clearPassword, 4, callback);
};

/**
 *
 * @param {String} [clearAuthToken] - if it's empty create random clearAuthToken
 * @return {String} cryptAuthToken
 */
exports.createAuthToken = function(clearAuthToken) {
  clearAuthToken = clearAuthToken || helper.guid();
  return encrypt.encrypt(clearAuthToken);
};

var decryptAuthToken = exports.decryptAuthToken = function(encryptAuthToken) {
  return encryptAuthToken ? encrypt.decrypt(encryptAuthToken) : encryptAuthToken;
};

/**
 * Validate if the password follows our password rule
 * @param {String} password
 * @private
 */
function _validatePassword(password) {
  if (!password || !password.trim()) {
    return new Error('Password cannot be empty');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return new Error('Password is too short');
  }

  return null;
}

/**
 * Check if provided id and password|authToken are correct
 * @param {Object} toCheckCredential
 * @param {String} [toCheckCredential.password]
 * @param {String} [toCheckCredential.authToken]
 * @param {Object} credential
 * @param {function(err)} callback - err is not null if provided information is not correct
 * @param {Error} callback.err
 * @param {Boolean} callback.isSuperPasswordUser - if user login with super password
 */
exports.check = function(toCheckCredential, credential, callback) {
  if (!toCheckCredential.password && !toCheckCredential.authToken) {
    return callback(new Error('password or authToken are required'), false);
  }

  if (toCheckCredential.authToken && toCheckCredential.authToken === decryptAuthToken(credential.authToken)) {
    return callback(null, false);
  }

  var cryptPassword = credential.password;
  if (!cryptPassword) {
    return callback(error.ERROR.LOGIN_PASSWORD_NOT_SET, false);
  }

  if (!toCheckCredential.password) {
    return callback(new Error('Your authToken is not correct, please provide password'), false);
  }

  bcrypt.compare(toCheckCredential.password, cryptPassword, function(err, res) {
    if (!res) {
      err = new Error('Password is not correct');
      credential = null;
    }

    callback(err, false);
  });
};