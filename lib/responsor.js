/**
 * User: ramon
 * Date: 6/3/14 4:00 PM 
 */

var plist = require('plist');
var logger = require('./logger').createLogger('Responsor');
var httpStatus = require('./httpStatus');
var error = require('./error');

exports.httpStatus = httpStatus;
exports.success = {};

exports.response = function(err, result, req, res) {
  var format = req.param('format') || req.params[0];
  switch (format) {
    case 'plist':
      return responsePlist(err, result, req, res);
    //case 'json':
    default :
      return responseJson(err, result, req, res);
  }
};

/**
 * Convert time property of obj to string, because time as integer is out of range of Obj-C integer
 * @param obj {Object | Array}
 */
function convertTimePropertyToStr(obj) {
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      obj[i] = convertTimePropertyToStr(obj[i]);
    }
  } else if (typeof(obj) === 'object') {
    for (var p in obj) {
      if (isTimeProperty(p) && typeof (obj[p]) === 'number') {
        obj[p] = obj[p].toString();
      } else if (typeof(obj[p] === 'object')) { // recursive convert obj[p]
        obj[p] = convertTimePropertyToStr(obj[p]);
      }
    }
  }

  return obj;
}

/**
 * Check the property name is time property, which has contains 'time', such as 'ctime' or 'mtime' or 'lcmtTime'.
 * So only make field name with 'time' if it's really Date type.
 * @param pname
 */
function isTimeProperty(pname) {
  return pname && pname.toLowerCase().indexOf('time') >= 0;
}

function responsePlist(err, result, req, res) {
  res.set('Content-Type', 'text/xml');

  result = result || "";
  if (result && result.hasOwnProperty('lastKey') && !result.lastKey) {  // lastKey is string
    result.lastKey = "";
  }

  var data = err ? {error: err.message || 'Unknown error'} : {plist: convertTimePropertyToStr(result)};

  var output = plist.build(data);

//  console.log(output);

  res.send(output);
}

function responseJson(err, result, req, res) {
  var status = httpStatus.OK;
  if (err) {
    logger.error({err:err}, 'Error: ' + (req.originalUrl || req.url));

    result = {
      error: err.code || error.ERROR.UNKNOWN_ERROR.id,
      errorText: err.message || error.ERROR.UNKNOWN_ERROR.en
    };

    status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  } else {
    if (Array.isArray(result)) {  // ensure array is in items property, so we can add more information in future if necessary
      result = {items: result};
    }

    result = {result: result || {}};
  }

  res.status(status).json(result);
}

exports.returnSimpleResponse = function (err, res) {
  var data = err ? ('error: ' + err) : 'success';
  res.send(data);
};