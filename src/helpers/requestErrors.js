const tokenNotFound = {
  message: 'Token not found',
  httpCode: 'unauthorized',
};

const invalidToken = {
  message: 'Expired or invalid token',
  httpCode: 'unauthorized',
};

const invalidUserNameOrPassword = {
  message: 'Username or password incorrect',
  httpCode: 'badRequest',
};

module.exports = {
  tokenNotFound,
  invalidToken,
  invalidUserNameOrPassword,
};
