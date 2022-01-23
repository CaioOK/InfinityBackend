require('dotenv').config();

const { USER_NAME, PASSWORD, HOST, DATABASE, DATABASE_TEST } = process.env;

module.exports = {
  development: {
    username: USER_NAME,
    password: PASSWORD,
    database: DATABASE,
    host: HOST,
    dialect: 'mysql',
  },
  test: {
    username: USER_NAME,
    password: PASSWORD,
    database: DATABASE_TEST,
    host: HOST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: USER_NAME,
    password: PASSWORD,
    database: DATABASE,
    host: HOST,
    dialect: 'mysql',
  },
};
