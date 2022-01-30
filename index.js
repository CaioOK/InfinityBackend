const express = require('express');
const bodyParser = require('body-parser');

const {
  createProfile,
  login,
  createUser,
  showUsers,
} = require('./src/controllers/Users');

const errorMiddleware = require('./src/middlewares/Error');
const authMiddleware = require('./src/middlewares/Auth');

require('dotenv').config();

const app = express();

// const { PORT = 3000 } = process.env;

const PORT = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT;

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando!' });
});

app.get('/users', authMiddleware, showUsers);

app.post('/login', login);

app.post('/profile/new', createProfile);

app.post('/users/new', authMiddleware, createUser);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

module.exports = app;
