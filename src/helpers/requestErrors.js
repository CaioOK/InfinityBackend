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

const incorrectEmail = {
  message: 'Email must be the same as the profile',
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

const userNotFound = {
  message: 'User not found',
  httpCode: 'notFound',
};

const provideAtLeastOneField = {
  message: 'You must provide at least a name, email, phone, cpf or role',
  httpCode: 'unprocessableEntity',
};

const categoryNotFound = {
  message: 'Category not found',
  httpCode: 'notFound',
};

const storeAlreadyRegistered = {
  message: 'Store name or localization already registered',
  httpCode: 'conflict',
};

module.exports = {
  tokenNotFound,
  invalidToken,
  invalidEmailOrPassword,
  userAlreadyRegistered,
  incorrectEmail,
  incorrectPageNumber,
  onlyForAdmins,
  userNotFound,
  provideAtLeastOneField,
  categoryNotFound,
  storeAlreadyRegistered,
};
