require('dotenv').config();

const { USER_NAME, PASSWORD, HOST, DATABASE } = process.env;

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
    database: DATABASE,
    host: HOST,
    dialect: 'mysql',
  },
  production: {
    username: USER_NAME,
    password: PASSWORD,
    database: DATABASE,
    host: HOST,
    dialect: 'mysql',
  },
};
