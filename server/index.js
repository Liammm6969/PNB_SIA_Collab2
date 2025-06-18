// Main server entry point
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./_user/user.route');
const accRoutes = require('./_account/acc.route');
const paymentRoutes = require('./_payment/payment.route');
const cardRoutes = require('./_card/card.route');

const app = express();
const PORT = 3000;
const MONGO_URI =  'mongodb://localhost:27017/pnb_sia';
const HOST = '192.168.0.120';

app.use(bodyParser.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/accounts', accRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cards', cardRoutes);

// Health check
app.get('/', (req, res) => res.send('PNB SIA API Running'));

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
