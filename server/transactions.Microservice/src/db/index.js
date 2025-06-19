const mongoose = require('mongoose');
const config = require('../lib/config');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoDb.MONGO_URI, config.mongoDb.options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
module.exports = connectToDatabase;
