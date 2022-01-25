const Joi = require('joi');

const profileSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  userName: Joi.string().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

module.exports = {
  profileSchema,
  loginSchema,
};
