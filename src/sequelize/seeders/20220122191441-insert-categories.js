module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories',[
      {
        id: 1,
        name: 'Departamento',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Agropecuária',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        name: 'Esporte e lazer',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ], { });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
