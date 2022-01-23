const express = require('express');
const bodyParser = require('body-parser');

const errorMiddleware = require('./src/middlewares/Error');
// const authMiddleware = require('./src/middlewares/Auth');

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando!' });
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server runnint at port: ${PORT}`));
