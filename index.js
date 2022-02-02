const express = require('express');
const bodyParser = require('body-parser');

const {
  createProfile,
  login,
  createUser,
  findAllUsers,
  findUserById,
  updateAnUser,
} = require('./src/controllers/Users');
const { createStore } = require('./src/controllers/Stores');

const errorMiddleware = require('./src/middlewares/error');
const authMiddleware = require('./src/middlewares/auth');
const adminRequired = require('./src/middlewares/adminRequired');

require('dotenv').config();

const app = express();

// const { PORT = 3000 } = process.env;

const PORT = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT;

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando!' });
});

app.get('/users', authMiddleware, adminRequired, findAllUsers);

app.get('/users/:id', authMiddleware, adminRequired, findUserById);

app.post('/login', login);

app.post('/profile/new', createProfile);

app.post('/stores/new', authMiddleware, adminRequired, createStore);

app.post('/users/new', authMiddleware, createUser);

app.put('/users/update/:id', authMiddleware, adminRequired, updateAnUser);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

module.exports = app;
