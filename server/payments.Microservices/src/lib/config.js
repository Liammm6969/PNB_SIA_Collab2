const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PAYMENT_PORT || "7000",
  HOST: process.env.HOST || "localhost",
  mongoDb: {
    MONGO_URI: process.env.PAYMENT_MONGO_URI || "mongodb+srv://hedtjyuzon:Jaffmier0924@bankcluster.cmlw7zw.mongodb.net/",
    options: {
      minPoolSize: Number(process.env.OPTIONS_DB_MINIMUMPOOLSIZE || 5),
      maxPoolSize: Number(process.env.OPTIONS_DB_MAXIMUMPOOLSIZE || 30),
      serverSelectionTimeoutMS: process.env.OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS,
      socketTimeoutMS: process.env.OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS,
    }
  }
}