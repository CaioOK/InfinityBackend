const rescue = require('express-rescue');
const Sequelize = require('sequelize');
const { Store, Category } = require('../sequelize/models');
const {
  createStoreSchema,
  pageNumberSchema,
  updateStoreSchema,
} = require('../helpers/joiSchemas');
const {
  categoryNotFound,
  storeAlreadyRegistered,
  incorrectPageNumber,
  provideAtLeastOneField,
  storeNotFound,
} = require('../helpers/requestErrors');

const storeWithCategoryConfig = {
  attributes: { exclude: ['category_id', 'createdAt', 'updatedAt'] },
  include: [
    { model: Category,
      as: 'category',
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    },
  ],
};

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

const findStores = rescue(async (req, res, next) => {
  const { page = 1, name = '', category = '' } = req.query;

  const storesPerPage = 10;

  const { error } = pageNumberSchema.validate({ page });

  if (error) return next(incorrectPageNumber);

  const { like, or } = Sequelize.Op;

  const storesFound = await Store.findAll({
    where: { 
      [or]: [
        { name: { [like]: `%${name}%` } },
        { description: { [like]: `%${name}%` } },
      ],
    },
    attributes: { exclude: ['category_id', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        where: { name: { [like]: `%${category}%` } },
      },
    ],
    offset: (page - 1) * storesPerPage,
    limit: storesPerPage,
    order: [['id', 'ASC']],
  });

  res.status(200).json(storesFound);
});

const updateStore = rescue(async (req, res, next) => {
  const { id } = req.params;

  const { error } = updateStoreSchema.validate(req.body);

  if (error) return next(error);

  // Se não foi fornecido pelomenos um campo retorna um erro
  if (!Object.keys(req.body).length) return next(provideAtLeastOneField);

  const storeFound = await Store.findByPk(id, storeWithCategoryConfig);

  if (!storeFound) return next(storeNotFound);

  try {
    await Store.update(req.body, { where: { id } });

    const updatedStore = await Store.findByPk(id, storeWithCategoryConfig);

    return res.status(200).json(updatedStore);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') return next(categoryNotFound);

    return next(storeAlreadyRegistered);
  }
});

module.exports = {
  createStore,
  findStores,
  updateStore,
};
