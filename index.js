const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger.json');

const {
  createProfile,
  login,
  createUser,
  findAllUsers,
  findUserById,
  updateAnUser,
} = require('./src/controllers/Users');
const {
  createStore,
  findStores,
  updateStore,
  deleteStore,
} = require('./src/controllers/Stores');

const errorMiddleware = require('./src/middlewares/error');
const authMiddleware = require('./src/middlewares/auth');
const adminRequired = require('./src/middlewares/adminRequired');

require('dotenv').config();

const app = express();

// const { PORT = 3000 } = process.env;

const PORT = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT;

app.use(bodyParser.json());
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.delete('/stores/delete/:id', authMiddleware, adminRequired, deleteStore);

app.get('/stores', authMiddleware, findStores);

app.get('/users', authMiddleware, adminRequired, findAllUsers);

app.get('/users/:id', authMiddleware, adminRequired, findUserById);

app.post('/login', login);

app.post('/profile/new', createProfile);

app.post('/stores/new', authMiddleware, adminRequired, createStore);

app.post('/users/new', authMiddleware, createUser);

app.put('/stores/update/:id', authMiddleware, adminRequired, updateStore);

app.put('/users/update/:id', authMiddleware, adminRequired, updateAnUser);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

module.exports = app;
