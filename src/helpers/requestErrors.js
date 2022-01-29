const tokenNotFound = {
  message: 'Token not found',
  httpCode: 'unauthorized',
};

const invalidToken = {
  message: 'Expired or invalid token',
  httpCode: 'unauthorized',
};

const invalidEmailOrPassword = {
  message: 'Email or password incorrect',
  httpCode: 'badRequest',
};

const userAlreadyRegistered = {
  message: 'User already registered',
  httpCode: 'conflict',
};

const nonAdminEmailError = {
  message: 'Email must be the same as the login',
  httpCode: 'badRequest',
};

module.exports = {
  tokenNotFound,
  invalidToken,
  invalidEmailOrPassword,
  userAlreadyRegistered,
  nonAdminEmailError,
};
