const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.USER_PORT,
  HOST: process.env.HOST,
  mongoDb: {
    MONGO_URI: process.env.USER_MONGO_URI,
    options: {
      minPoolSize: Number(process.env.OPTIONS_DB_MINIMUMPOOLSIZE || 5),
      maxPoolSize: Number(process.env.OPTIONS_DB_MAXIMUMPOOLSIZE || 30),
      serverSelectionTimeoutMS: process.env.OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS,
      socketTimeoutMS: process.env.OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS,
    }
  }
}