const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

const tokenGenerator = (dataObj, expiresIn = '1d') => {
  const jwtConfig = {
    expiresIn,
    algorithm: 'HS256',
  };

  return jwt.sign(dataObj, JWT_SECRET, jwtConfig);
};

const tokenValidator = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  tokenGenerator,
  tokenValidator,
};
