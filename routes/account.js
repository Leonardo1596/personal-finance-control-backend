const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/Account');

router.post('/account/create', AccountController.createAccount);
router.delete('/users/:userId/accounts/:accountId', AccountController.deleteAccount);
router.put('/users/:userId/accounts/:accountId', AccountController.updateAccount);
router.get('/users/:userId/accounts', AccountController.getAccountsByUser);

module.exports = router;