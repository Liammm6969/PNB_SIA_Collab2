const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  mongoDb: {
    MONGO_URI: process.env.MONGO_URI,
    options: {
      minPoolSize: Number(process.env.OPTIONS_DB_MINIMUMPOOLSIZE || 5),
      maxPoolSize: Number(process.env.OPTIONS_DB_MAXIMUMPOOLSIZE || 30),
      serverSelectionTimeoutMS: process.env.OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS,
      socketTimeoutMS: process.env.OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS,
    }
  }
}