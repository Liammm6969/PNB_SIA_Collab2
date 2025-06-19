const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user.route');

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// MongoDB connection
const PORT = process.env.USER_PORT;
const HOST = process.env.HOST;
const MONGO_URI = process.env.USER_MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, HOST, () => console.log(`User Service running on http://${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });