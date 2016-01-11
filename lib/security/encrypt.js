/**
 * Created by ramon on 4/22/15.
 */

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = exports.password = 'payrange_code_chanllenge';
var inputEncoding = 'utf8';
var outputEncoding = 'base64';

exports.encrypt = function(str) {
  var cipher = crypto.createCipher(algorithm, password);
  var encrypted = cipher.update(str, inputEncoding, outputEncoding);
  encrypted += cipher.final(outputEncoding);
  return encrypted;
};

exports.decrypt = function(str) {
  var decipher = crypto.createDecipher(algorithm, password);
  var decrypted = decipher.update(str, outputEncoding, inputEncoding);
  decrypted += decipher.final(inputEncoding);
  return decrypted;
};