const express = require('express');

const userRoutes = require('./src/routes/user.route');
const config = require('./src/lib/config.js');
const ConnectToDb = require('./src/db/index');
const { RouteNotFoundErrorMiddleware } = require('./src/middleware/index');

const app = express();
app.use(express.json());

// Connect to MongoDB
ConnectToDb();

app.get('/', (req, res) => {
  res.send('User Microservice is running');
});
// Routes
app.use('/api/users', userRoutes);

app.use(RouteNotFoundErrorMiddleware);






app.listen(config.PORT, config.HOST, () => {
  console.log(`User Microservice running at http://${config.HOST}:${config.PORT}`);
});