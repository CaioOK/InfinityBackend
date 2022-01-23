const jwt = require('jsonwebtoken');

const {
  tokenNotFound,
  invalidToken,
} = require('../helpers/requestErrors');

require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = async (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) return next(tokenNotFound);

  try {
    const { id, userName, role } = jwt.verify(token, JWT_SECRET);

    req.user = { id, userName, role };

    return next();
  } catch (err) {
    return next(invalidToken);
  }
};
