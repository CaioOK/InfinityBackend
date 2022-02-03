const Joi = require('joi');

const phoneRegExp = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
);

const cpfRegExp = new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);

const profileSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().not().empty().required(),
});

const newUserSchema = Joi.object({
  name: Joi.string().not().empty().required(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  email: Joi.string().email().required(),
  cpf: Joi.string().pattern(cpfRegExp).required(),
});

const pageNumberSchema = Joi.object({
  page: Joi.number().integer().min(1),
});

const updateUserSchema = Joi.object({
  name: Joi.string().not().empty(),
  phone: Joi.string().pattern(phoneRegExp),
  email: Joi.string().email(),
  cpf: Joi.string().pattern(cpfRegExp),
  role: Joi.string().pattern(/(\buser\b|\badmin\b)/),
});

const createStoreSchema = Joi.object({ 
  name: Joi.string().not().empty().required(),
  description: Joi.string().not().empty().required(),
  localization: Joi.string().not().empty().required(),
  categoryId: Joi.number().options({ convert: false }).required(),
  logo: Joi.string().not().empty().required(),
});

const updateStoreSchema = Joi.object({
  name: Joi.string().not().empty(),
  description: Joi.string().not().empty(),
  localization: Joi.string().not().empty(),
  categoryId: Joi.number().options({ convert: false }),
  logo: Joi.string().not().empty(),
});

module.exports = {
  profileSchema,
  loginSchema,
  newUserSchema,
  pageNumberSchema,
  updateUserSchema,
  createStoreSchema,
  updateStoreSchema,
};
