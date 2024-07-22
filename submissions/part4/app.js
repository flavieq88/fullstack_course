const { MONGODB_URI, PORT } = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch(error => {
    info('error connecting to MongoDB:', error.message);
  });
  
//middlewares
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
