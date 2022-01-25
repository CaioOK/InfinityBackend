const {
  tokenNotFound,
  invalidToken,
} = require('../helpers/requestErrors');
const { tokenValidator } = require('../helpers/tokenHandler');

module.exports = async (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) return next(tokenNotFound);

  try {
    const { id, userName, role } = tokenValidator(token);

    req.user = { id, userName, role };

    return next();
  } catch (err) {
    return next(invalidToken);
  }
};
