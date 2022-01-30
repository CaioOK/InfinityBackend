const rescue = require('express-rescue');
const { Profile, User } = require('../sequelize/models');
const { tokenGenerator } = require('../helpers/tokenHandler');
const {
  invalidEmailOrPassword,
  userAlreadyRegistered,
  incorrectEmail,
  incorrectPageNumber,
  onlyForAdmins,
  userNotFound,
} = require('../helpers/requestErrors');
const {
  profileSchema,
  loginSchema,
  newUserSchema,
  pageNumberSchema,
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
  const { id: profileId, email: tokenEmail } = req.user;

  const { error } = newUserSchema.validate(req.body);

  if (error) return next(error);

  if (tokenEmail !== email) return next(incorrectEmail);

  try {
    await User.create({ name, phone, email, cpf, profileId });
  
    return res.status(201).json({ name, phone, email, cpf, profileId });
  } catch (err) {
    return next(userAlreadyRegistered);
  }
});

const showUsers = rescue(async (req, res, next) => {
  const { page = 1 } = req.query;
  const { role } = req.user;

  if (role !== 'admin') return next(onlyForAdmins);

  const usersPerPage = 10;

  const { error } = pageNumberSchema.validate({ page });

  if (error) return next(incorrectPageNumber);

  const users = await User.findAll({
    attributes: {
      exclude: ['profileId', 'profile_id', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    ],
    offset: (page - 1) * usersPerPage,
    limit: usersPerPage,
  });

  res.status(200).json(users);
});

const findUserById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'admin') return next(onlyForAdmins);

  const userFound = await User.findByPk(id, {
    attributes: {
      exclude: ['profileId', 'profile_id', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!userFound) return next(userNotFound);

  return res.status(200).json(userFound);
});

module.exports = {
  createProfile,
  login,
  createUser,
  showUsers,
  findUserById,
};
