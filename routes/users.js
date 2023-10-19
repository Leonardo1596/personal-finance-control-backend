const User = require('../models/UserSchema');
const Account = require('../models/AccountSchema');
const BillToPay = require('../models/BillToPay');

const express = require('express');
const router = express.Router();

router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const accounts = await Account.find({ userId: user._id });
        const billsToPay = await BillToPay.find({ userId: user._id });

        const userData = {
            _id: user._id,
            email: user.email,
            username: user.username,
            accounts: accounts,
            bills_to_pay: billsToPay
        };
        res.json({ user: userData });
    } catch (error) {
        console.error('Ocorreu um erro ao buscar o usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});

module.exports = router;