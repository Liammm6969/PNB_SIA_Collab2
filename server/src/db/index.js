const mongoose = require('mongoose');
const config = require('../lib/config.js');

const connectDB = async () => {
  mongoose.connect(config.mongoDb.MONGO_URI, config.mongoDb.options)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
}

module.exports = connectDB; 