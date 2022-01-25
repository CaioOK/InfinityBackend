const rescue = require('express-rescue');
const { Profile, User } = require('../sequelize/models');
const { tokenGenerator } = require('../helpers/tokenHandler');
const {
  invalidUserNameOrPassword,
  userAlreadyRegistered,
} = require('../helpers/requestErrors');
const {
  profileSchema,
  loginSchema,
  newUserSchema,
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

const createUser = rescue(async (req, res, next) => {
  const { name, phone, email, cpf } = req.body;
  const { id: profileId } = req.user;

  const { error } = newUserSchema.validate(req.body);

  if (error) return next(error);

  const newUser = await User.create({ name, phone, email, cpf, profileId });

  return res.status(201).json(newUser);
});

module.exports = {
  createProfile,
  login,
  createUser,
};
