/**
 * User: ramon
 * Date: 6/3/14 4:00 PM 
 */

var logger = require('./logger').createLogger('Responsor');
var httpStatus = require('./httpStatus');
var error = require('./error');

exports.httpStatus = httpStatus;
exports.success = {};

exports.response = function(err, result, req, res) {
  var format = req.param('format') || req.params[0];
  switch (format) {
    //case 'xml': reponseXml(err, result, req, res); break;
    //case 'json':
    default :
      return responseJson(err, result, req, res);
  }
};

function responseJson(err, result, req, res) {
  var status = httpStatus.OK;
  if (err) {
    logger.error({err:err}, 'Error: ' + (req.originalUrl || req.url));

    result = {
      error: err.code || error.ERROR.UNKNOWN_ERROR.id,
      errorText: err.message || error.ERROR.UNKNOWN_ERROR.en
    };

    status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  }

  res.status(status).json(result);
}