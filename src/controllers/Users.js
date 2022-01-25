const rescue = require('express-rescue');
const { Profile } = require('../sequelize/models');
const { tokenGenerator } = require('../helpers/tokenHandler');
const {
  invalidUserNameOrPassword,
  userAlreadyRegistered,
} = require('../helpers/requestErrors');
const {
  profileSchema,
  loginSchema,
} = require('../helpers/joiSchemas');

const createProfile = rescue(async (req, res, next) => {
  const { userName, password } = req.body;

  const { error } = profileSchema.validate(req.body);

  if (error) return next(error);

  try {
    const { id, role } = await Profile.create({ userName, password });

    const token = tokenGenerator({ id, userName, role });

    res.status(201).json({ id, userName, role, token });
  } catch (err) {
    if (err.errors[0].type === 'unique violation') return next(userAlreadyRegistered);

    next(err);
  }
});

const login = rescue(async (req, res, next) => {
  const { userName, password } = req.body;

  const { error } = loginSchema.validate(req.body);

  if (error) return next(error);

  const profile = await Profile.findOne({ where: { userName, password } });

  if (!profile) return next(invalidUserNameOrPassword);

  const { id, role } = profile;

  const token = tokenGenerator({ id, userName, role });

  return res.status(200).json({ token });
});

module.exports = {
  createProfile,
  login,
};
