/**
 * Created by ramon on 3/4/15.
 */
"use strict";

module.exports = {
  // This error is only occurs on nginx gateway
  GATEWAY_ERROR: {
    id: "Server::GateWayError",
    en: "Sorry, the server is busy. Please try again later."
  },

  UNKNOWN_ERROR: {
    id: "Server::UnknownError",
    en: "We are waiting for the Wizard. Please try again later."
  },

  ID_NOT_FOUND: {
    id: "Server::IdNotFound",
    en: "Oops, the object is not found"
  },

  DYNAMO_DB_ERROR: {
    id: 'Server::DynamoDBError',
    en: "Dynamodb Error"
  },

  PERMISSION_IS_REQUIRED: {
    id: "Server::PermissionIsRequired",
    en: "Admin permission is required"
  }
};