const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/payment.route');
const transactionRoutes = require('./routes/transaction.route');
const userRoutes = require('./routes/user.route');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PAYMENT_PORT;
const HOST = process.env.HOST;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, HOST, () => {
      console.log(`Payment Service running on http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });