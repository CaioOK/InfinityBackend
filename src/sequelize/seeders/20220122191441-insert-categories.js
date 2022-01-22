module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories',[
      {
        id: 1,
        name: 'Varejo',
      },
      {
        id: 2,
        name: 'Agropecuária',
      },
      {
        id: 3,
        name: 'Esporte e lazer',
      },
    ], { timestamps: false });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
