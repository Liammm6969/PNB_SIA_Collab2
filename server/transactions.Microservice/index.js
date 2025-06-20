const express = require('express');
const config = require("./src/lib/config.js");
const transactionsRoutes = require('./src/routes/transactions.route.js');
const { RouteNotFoundErrorMiddleware } = require('./src/middleware/index.js');
const connectToDatabase = require("./src/db/index.js");


const app = express();
app.use(express.json());




connectToDatabase();

app.get('/', (req, res) => {
  res.send('Transactions Microservice is running');
});
// Routes
app.use('/api/transactions', transactionsRoutes);


app.use(RouteNotFoundErrorMiddleware);


app.listen(config.PORT, () => {
  console.log(`Transactions Microservice running on http://${config.HOST}:${config.PORT}`);
});


