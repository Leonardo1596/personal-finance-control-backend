require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const notificationService = require('./services/notificationService');

// Import Routes
const routeHomeApi = require('./routes/homeApi');
const routeAuth = require('./routes/auth');
const routeAccount = require('./routes/account');
const routeCreditCard = require('./routes/creditCard');
const routeTransaction = require('./routes/transaction');
const routeUsers = require('./routes/users');
const routeNotifications = require('./routes/notification');

// Routes
app.use(routeHomeApi);
app.use(routeAuth);
app.use(routeAccount);
app.use(routeCreditCard);
app.use(routeTransaction);
app.use(routeUsers);
app.use(routeNotifications);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.emit('ready');
        console.log('Connected to MongoDB');
    })
    .catch((error) => console.log(error));


notificationService.start();

// Server
app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`http://localhost:${port}`);
    });
})