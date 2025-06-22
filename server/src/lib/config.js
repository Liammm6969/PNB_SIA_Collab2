const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  PORT: "4000",
  HOST: "localhost",
  mongoDb: {
    MONGO_URI: "mongodb+srv://hedtjyuzon:Jaffmier0924@bankcluster.cmlw7zw.mongodb.net/PNBDb",
    options: {
      minPoolSize: Number(process.env.OPTIONS_DB_MINIMUMPOOLSIZE || 5),
      maxPoolSize: Number(process.env.OPTIONS_DB_MAXIMUMPOOLSIZE || 30),
      serverSelectionTimeoutMS: process.env.OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS,
      socketTimeoutMS: process.env.OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS,
    }
  }
}