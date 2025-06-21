const express = require('express');
const cors = require('cors');

const config = require("./src/lib/config.js");

const ConnectToDb = require("./src/db/index.js");
const PNBRoutes = require('./src/routes/index.js');

const { RouteNotFoundErrorMiddleware } = require('./src/middleware/index.js');

const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
ConnectToDb();

// Routes
app.use('/api/Philippine-National-Bank', PNBRoutes);
// Also support legacy client routes for compatibility

app.use(RouteNotFoundErrorMiddleware);


app.listen(config.PORT, config.HOST, () => {
  console.log(`PNB Microservice running at http://${config.HOST}:${config.PORT}`);
});