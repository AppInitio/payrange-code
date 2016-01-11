/**
 * Created by ramon on 7/23/15.
 */

"use strict";

var helper = require('../helper');
var logger = require('../logger').logger;

module.exports= function(req, res, next) {
  _addTimer(req, res);

  next();
};

function _addTimer(req, res) {
  var startTime = new Date();
  var url = req.originalUrl || req.url;
  req._reqId = 'reqId-' + startTime.getTime();
  var method = req.method;
  var params = helper.extractParamsFromReq(req);

  logger.debug({
    reqId: req._reqId,
    fromIp: req.ip,
    url: url,
    method: method,
    startTime: startTime,
    params: params
  }, 'begin request ===>');

  function logRequest(){
    res.removeListener('finish', logRequest);
    res.removeListener('close', logRequest);

    logger.debug({
      reqId: req._reqId,
      url: url,
      method: method,
      status: res.statusCode,
      endTime: new Date(),
      duration: (new Date() - startTime)
    }, '<=== end request');
  }

  res.on('finish', logRequest);
  res.on('close', logRequest);
}