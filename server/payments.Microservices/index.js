const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const config = require("./src/lib/config.js");
const paymentRoutes = require('./src/routes/payment.route.js');
const connectDB = require('./src/db/index.js');
const { RouteNotFoundErrorMiddleware } = require('./src/middleware/index.js');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


connectDB();


app.use('/api/payments', paymentRoutes);

app.use(RouteNotFoundErrorMiddleware);


app.listen(config.PORT, config.HOST, () => {
  console.log(`Payment Service running on http://${config.HOST}:${config.PORT}`);
});