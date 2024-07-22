const MONGODB_URI = require('./utils/config').MONGODB_URI;
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.info('error connecting to MongoDB:', error.message);
  });

//middlewares
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
