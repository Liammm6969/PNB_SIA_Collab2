const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const transactionsRoutes = require('./routes/transactions.route');

const app = express();
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoutes);

// MongoDB connection
const PORT = process.env.TRANSACTION_PORT;
const HOST = process.env.HOST;
const MONGO_URI = process.env.TRANSACTION_MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, HOST, () => console.log(`Transaction Service running on http://${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });