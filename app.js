const express = require('express');
const middlewares = require('./middlewares.js');
require('dotenv').config();
require('./database');

// API Routes
const apiRoutes = require('./api/api.router').router;

// init application
const app = express();
const port = process.env.PORT || 3000;
middlewares.setupMiddlewares(app); // protect the endpoints with passport authenticate.

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello, World!!!"});
});

// Use routes
app.use('/api', apiRoutes);

// Start listening on a specific PORT
app.listen(port, () => console.log(`Server started ar port ${port}`));
exports.app = app;