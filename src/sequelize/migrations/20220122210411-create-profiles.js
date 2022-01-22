module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_name',
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.dropTable('Profiles');
  }
};
