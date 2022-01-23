module.exports = {
  async up (queryInterface, _Sequelize) {
    return queryInterface.bulkInsert('Profiles', [
      {
        id: 1,
        user_name: 'mrrobot',
        password: 'tyrellpenosaco',
        role: 'admin',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        user_name: 'yudi',
        password: 'playstation2',
        role: 'user',
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete('Profiles', null, {});
  }
};
