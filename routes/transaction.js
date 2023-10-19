const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.post('/transaction/create', TransactionController.createTransaction);
router.delete('/transaction/delete/:userId/:accountId/:transactionId', TransactionController.deleteTransaction);
router.delete('/bill_to_pay/delete/:userId/:billToPayId', TransactionController.deleteBillToPay);
router.put('/transaction/update/:userId/:accountId/:transactionId', TransactionController.updateTransaction);
router.get('/transactions/:userId/:accountId', TransactionController.getTransactionByUser);
router.get('/transactions/:userId', TransactionController.getAllTransactionsByUser);
router.get('/bills_to_pay/:userId', TransactionController.getBillToPayByUser);   // Bills to pay

module.exports = router;