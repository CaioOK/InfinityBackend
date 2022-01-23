module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stores', [
      {
        id: 1,
        name: 'Magazine Luiza',
        description: `As melhores ofertas em móveis, eletrônicos, eletrodomésticos,
        informática e muito mais.`,
        localization: '-18.920579805819322, -48.279375254693505',
        category_id: 1,
        logo: 'https://tm.ibxk.com.br/2021/04/14/14102931597147.jpg?ims=1120x420',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Centauro',
        description: `As Lojas Centauro fazem parte de uma rede brasileira multicanal de 
        artigos esportivos. `,
        localization: '-18.908767839079005, -48.26116555981498',
        category_id: 3,
        logo: 'https://tm.ibxk.com.br/2021/04/14/14102931597147.jpg?ims=1120x420',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        name: 'Ruraltech',
        description: `Somos o braço direito do produtor rural, do veterinário e de todos
        os empresários que atuam nos segmentos Agro e Pet, em várias regiões do Brasil.`,
        localization: '-18.89814395042913, -48.262246777005394',
        category_id: 2,
        logo: 'https://ruraltech.net.br/data/upload/logo/logomarca.png',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]);
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete('Stores', null, {});
  }
};
