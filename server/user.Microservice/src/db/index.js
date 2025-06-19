const mongoose = require('mongoose');
const config = require('../lib/config');
const ConnectToDb = async () => {
  await mongoose.connect(config.mongoDb.MONGO_URI, config.mongoDb.options)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
}
module.exports = ConnectToDb;