const {
  tokenNotFound,
  invalidToken,
} = require('../helpers/requestErrors');
const { tokenValidator } = require('../helpers/tokenHandler');

module.exports = async (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return next(tokenNotFound);
  try {
    const [, token] = authorization.split(' ');
    const { id, email, role } = tokenValidator(token);

    req.user = { id, email, role };

    return next();
  } catch (err) {
    return next(invalidToken);
  }
};
