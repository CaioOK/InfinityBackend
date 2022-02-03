const rescue = require('express-rescue');
const Sequelize = require('sequelize');
const { Store, Category } = require('../sequelize/models');
const {
  createStoreSchema,
  pageNumberSchema,
} = require('../helpers/joiSchemas');
const {
  categoryNotFound,
  storeAlreadyRegistered,
  incorrectPageNumber,
} = require('../helpers/requestErrors');

// const storeWithCategoryConfig = {
//   attributes: { exclude: ['category_id', 'createdAt', 'updatedAt'] },
//   include: [
//     { model: Category,
//       as: 'category',
//       attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
//     },
//   ],
// };

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

const findAllStores = rescue(async (req, res, next) => {
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
  });

  res.status(200).json(storesFound);
});

module.exports = {
  createStore,
  findAllStores,
};
