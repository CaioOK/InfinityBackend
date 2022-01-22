module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    localization: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    logo: DataTypes.STRING,
  });

  Store.associate = (models) => {
    Store.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }

  return Store;
};
