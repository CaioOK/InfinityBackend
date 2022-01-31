const { onlyForAdmins } = require('../helpers/requestErrors');

module.exports = async (req, _res, next) => {
  const { role } = req.user;

  if (role !== 'admin') return next(onlyForAdmins);

  return next();
};
