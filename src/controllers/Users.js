const rescue = require('express-rescue');
const { Profile, User } = require('../sequelize/models');
const { tokenGenerator } = require('../helpers/tokenHandler');
const {
  invalidEmailOrPassword,
  userAlreadyRegistered,
  nonAdminEmailError,
} = require('../helpers/requestErrors');
const {
  profileSchema,
  loginSchema,
  newUserSchema,
} = require('../helpers/joiSchemas');

const createProfile = rescue(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = profileSchema.validate(req.body);

  if (error) return next(error);

  try {
    const { id, role } = await Profile.create({ email, password });

    const token = tokenGenerator({ id, email, role });

    res.status(201).json({ id, email, role, token });
  } catch (err) {
    if (err.errors[0].type === 'unique violation') return next(userAlreadyRegistered);

    next(err);
  }
});

const login = rescue(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);

  if (error) return next(error);

  const profile = await Profile.findOne({ where: { email, password } });

  if (!profile) return next(invalidEmailOrPassword);

  const { id, role } = profile;

  const token = tokenGenerator({ id, email, role });

  return res.status(200).json({ token });
});

const createUser = rescue(async (req, res, next) => {
  const { name, phone, email, cpf } = req.body;
  const { id: profileId, email: tokenEmail, role } = req.user;

  const { error } = newUserSchema.validate(req.body);

  if (error) return next(error);

  if (role !== 'admin' && tokenEmail !== email) return next(nonAdminEmailError);

  try {
    await User.create({ name, phone, email, cpf, profileId });
  
    return res.status(201).json({ name, phone, email, cpf, profileId });
  } catch (err) {
    return next(userAlreadyRegistered);
  }
});

module.exports = {
  createProfile,
  login,
  createUser,
};
