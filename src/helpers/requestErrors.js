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

const incorrectPageNumber = {
  message: '"page" must be an integer greater than or equal to 1',
  httpCode: 'unprocessableEntity',
};

const onlyForAdmins = {
  message: 'You do not have access rights, please contact an administrator',
  httpCode: 'unauthorized',
};

module.exports = {
  tokenNotFound,
  invalidToken,
  invalidEmailOrPassword,
  userAlreadyRegistered,
  nonAdminEmailError,
  incorrectPageNumber,
  onlyForAdmins,
};
