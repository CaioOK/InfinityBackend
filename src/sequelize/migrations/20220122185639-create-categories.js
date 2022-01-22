module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
    });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.dropTable('Categories');
  }
};
