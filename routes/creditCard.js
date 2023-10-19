const express = require('express');
const router = express.Router();
const CreditCardController = require('../controllers/CreditCard');

router.post('/credit-card/create', CreditCardController.createCreditCard);
// router.get('/users/:userId/accounts', AccountController.getAccountsByUser);

module.exports = router;