const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rescue = require('express-rescue');
const { Profile } = require('../sequelize/models');
const {
  invalidUserNameOrPassword,
} = require('../helpers/requestErrors');

require('dotenv').config();

const { JWT_SECRET } = process.env;

const profileSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  userName: Joi.string().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

const createProfile = rescue(async (req, res, next) => {
  const { userName, password } = req.body;

  const { error } = profileSchema.validate(req.body);

  if (error) return next(error);

  try {
    const { id, role } = await Profile.create({ userName, password });

    const jwtConfig = {
      expiresIn: '1d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ id, userName, role }, JWT_SECRET, jwtConfig);

    res.status(201).json({ id, userName, role, token });
  } catch (err) {
    console.log(err);

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

  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  const token = jwt.sign({ id, userName, role }, JWT_SECRET, jwtConfig);

  return res.status(200).json({ token });
});

module.exports = {
  createProfile,
  login,
};
