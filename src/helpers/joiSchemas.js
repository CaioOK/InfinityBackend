const Joi = require('joi');

const phoneRegExp = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
);

const cpfRegExp = new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);

const profileSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  userName: Joi.string().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

const newUserSchema = Joi.object({
  name: Joi.string().not().empty().required(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  email: Joi.string().email().required(),
  cpf: Joi.string().pattern(cpfRegExp).required(),
});

module.exports = {
  profileSchema,
  loginSchema,
  newUserSchema,
};
