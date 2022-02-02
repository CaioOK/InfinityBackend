const rescue = require('express-rescue');
const { Store, Category } = require('../sequelize/models');
const { createStoreSchema } = require('../helpers/joiSchemas');
const {
  categoryNotFound,
  storeAlreadyRegistered,
} = require('../helpers/requestErrors');

const createStore = rescue(async (req, res, next) => {
  const { name, description, localization, categoryId, logo } = req.body;

  const { error } = createStoreSchema.validate(req.body);

  if (error) return next(error);

  const category = await Category.findByPk(categoryId);
  
  if (!category) return next(categoryNotFound);

  const { id, name: categoryName } = category.dataValues;

  try {
    await Store.create({ name, description, localization, categoryId, logo });

    return res.status(201).json({ id, ...req.body, category: categoryName });
  } catch (err) {
    return next(storeAlreadyRegistered);
  }
});

module.exports = {
  createStore,
};
