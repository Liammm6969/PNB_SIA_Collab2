const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const config = require("./src/lib/config.js");

const ConnectToDb = require("./src/db/index.js");
const PNBRoutes = require('./src/routes/index.js');

const { RouteNotFoundErrorMiddleware } = require('./src/middleware/index.js');

const app = express();
app.use(express.json());

// CORS configuration for credentials support
const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieparser());

// Connect to MongoDB
ConnectToDb();

// Routes
app.use('/api/Philippine-National-Bank', PNBRoutes);


app.use(RouteNotFoundErrorMiddleware);


app.listen(config.PORT, config.HOST, () => {
  console.log(`PNB running at http://${config.HOST}:${config.PORT}/api/Philippine-National-Bank`);
});