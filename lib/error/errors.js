/**
 * Created by ramon on 3/4/15.
 */
"use strict";

module.exports = {
  // This error is only occurs on nginx gateway
  GATEWAY_ERROR: {
    id: "Server::GateWayError",
    en: "Sorry, the server is busy. Please try again later.",
    xx: "xx: Sorry, the server is busy. Please try again later."
  },

  UNKNOWN_ERROR: {
    id: "Server::UnknownError",
    en: "We are waiting for the Wizard. Please try again later.",
    xx: "xx: We are waiting for the Wizard. Please try again later."
  },

  ID_NOT_FOUND: {
    id: "Server::IdNotFound",
    en: "Oops, looks like we're missing something! Please try again later.",
    xx: "xx: Oops, looks like we're missing something! Please try again later."
  },

  DYNAMO_DB_ERROR: {
    id: 'Server::DynamoDBError',
    en: "Wow, there's so much awesome activity in WonderBox! \nWe have to do some quick fixing, and will be back up shortly.",
    xx: "xx: Wow, there's so much awesome activity in WonderBox! \nWe have to do some quick fixing, and will be back up shortly."
  },

  FRIEND_REQUEST_EXIST: {
    id: "Server::FriendRequestExist",
    en: "You have already invited this person to be your friend. They will need your code to accept.",
    xx: "xx: You have already invited this person to be your friend. They will need your code to accept."
  },

  WOBO_USER_CANNOT_BE_REMOVED: {
    id: "Server::WoboUserCannotBeRemoved",
    en: "The Wizard cannot be removed!",
    xx: "xx: The Wizard cannot be removed!"
  },

  USER_CODE_NOT_EXISTING: {
    id: "Server::UserCodeNotExisting",
    en: "Sorry, that friend code does not exist.",
    xx: "xx: Sorry, that friend code does not exist."
  },

  TOKEN_INVALID: {
    id: "Server::TokenInvalid",
    en: "Sorry, this link doesn't work.",
    xx: "xx: Sorry, this link doesn't work."
  },

  TOKEN_EXPIRED: {
    id: "Server::TokenExpired",
    en: "Sorry, this link no longer works.",
    xx: "xx: Sorry, this link no longer works."
  },

  TOKEN_EXPIRED_FOR_PASSWORD_RESET: {
    id: "Server::TokenExpiredForPasswordReset",
    en: "Sorry! This link has expired. \nFor your safety, please re-enter your email here, and we'll send you a new link to reset your password. Thanks!",
    xx: "xx: Sorry! This link has expired. \nFor your safety, please re-enter your email here, and we'll send you a new link to reset your password. Thanks!"
  },

  LOGIN_USER_ON_DIFFERENT_DEVICE: {
    id: "Server::LoginUserOnDifferentDevice",
    en: "You last used WonderBox on a different device.  Do you want to continue?",
    xx: "xx: You last used WonderBox on a different device.  Do you want to continue?"
  },

  LOGIN_PARAMETERS_MISSING: {
    id: "Server::LoginParametersMissing",
    en: "Sorry, it looks like you need to sign in again.",
    xx: "xx: Sorry, it looks like you need to sign in again."
  },

  LOGIN_EMAIL_IS_USED: {
    id: "Server::LoginEmailIsUsed",
    en: "Sorry, that email has already been used.",
    xx: "xx: Sorry, that email has already been used."
  },

  LOGIN_EMAIL_NOT_EXIST: {
    id: "Server::LoginEmailNotExist",
    en: "Oops! This account does not exist. Please create a new account.",
    xx: "xx: Oops! This account does not exist. Please create a new account."
  },

  LOGIN_EMAIL_USED_IN_ANOTHER_MODE: {
    id: "Server::LoginEmailUsedInAnotherMode",
    en: "Oops! This email is already being used a different verison of WonderBox. Please use a different email. Thanks!",
    xx: "xx: Oops! This email is already being used a different verison of WonderBox. Please use a different email. Thanks!"
  },

  LOGIN_WRONG_APP_MODE: {
    id: "Server::LoginWrongAppMode",
    en: "Oops! This email is already being used a different verison of WonderBox. Please use a different email. Thanks!",
    xx: "xx: Oops! This email is already being used a different verison of WonderBox. Please use a different email. Thanks!"
  },

  LOGIN_WRONG_PASSWORD: {
    id: "Server::LoginWrongPassword",
    en: "Incorrect password.  Please try again.",
    xx: "xx: Incorrect password.  Please try again."
  },

  LOGIN_PASSWORD_NOT_SET: {
    id: "Server::LoginPasswordNotSet",
    en: "Please set up a password",
    xx: "xx: Please set up a password"
  },

  LOGIN_PASSWORD_TOO_SHORT: {
    id: "Server::LoginPasswordTooShort",
    en: "Password is too short. Please use at least 8 characters",
    xx: "xx: Password is too short. Please use at least 8 characters"
  },

  LOGIN_INVALID_AUTH_TOKEN: {
    id: "Server::LoginInvalidAuthToken",
    en: "Please sign in again.",
    xx: "xx: Please sign in again."
  },

  LOGIN_USER_NOT_FOUND: {
    id: "Server::LoginUserNotFound",
    en: "Cannot find your user",
    xx: "xx: Cannot find your user"
  },

  ACCOUNT_DELETED: {
    id: "UserSelect::AccountDeleted",
    en: "Sorry, we didn’t get your parent permission in time. So your account has been deleted. Please reinstall and setup a new account.",
    xx: "xx: Sorry, we didn’t get your parent permission in time. So your account has been deleted. Please reinstall and setup a new account."
  },

  ACCOUNT_NOT_FOUND: {
    id: "Server::AccountNotFound",
    en: "Sorry, there's no account with that email address.",
    xx: "xx: Sorry, there's no account with that email address."
  },

  ACCOUNT_ADULT_CONVERSION_REQUIRED: {
    id: 'Server::AccountAdultConversionRequired',
    en: 'Please finish setting up your account first.',
    xx: 'xx: Please finish setting up your account first.'
  },

  APP_NAME: {
    id: "Server::AppName",
    en: "WonderBox",
    xx: "xx: WonderBox"
  },

  STARTING_SERVER: {
    id: "Server::StartingServer",
    en: "We are waiting for the Wizard. Please check back later!",
    xx: "xx: We are waiting for the Wizard. Please check back later!"
  },

  PLAYER_MESSAGE_IS_REMOVED: {
    id: "Server::PlayerMessageIsRemoved",
    en: "The message you visited is removed",
    xx: "xx: The message you visited is removed"
  },

  FRIEND_REQUEST_IS_REMOVED: {
    id: "Server::FriendRequestIsRemoved",
    en: "The friend request is removed",
    xx: "xx: The friend request is removed"
  }
};