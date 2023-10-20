const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/AccountSchema');
const Transaction = require('../models/TransactionSchema');
const BillToPay = require('../models/BillToPay');



const register = (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hashedpass) => {
        if (err) {
            res.json({ error: err });
        }


        let user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedpass,
            confirmPassword: req.body.confirmPassword
        });


        // Check if email already exists
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    saveUser();
                } else {
                    console.log('email already exists');
                    res.json({ message: 'Email already exists' });
                }
            });


        function saveUser() {
            user.save()
                .then(user => {
                    // Create token
                    const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_KEY, {
                        expiresIn: '3600s'
                    });

                    // Após o usuário ser criado com sucesso, crie uma conta padrão
                    const newAccount = new Account({
                        userId: user._id,
                        accountName: "Conta Padrão",
                        balance: '0,00'
                    });

                    // Salve a nova conta padrão no banco de dados
                    newAccount.save();



                    console.log('Successfully registered');
                    console.log(`User: ${user.username}`);
                    console.log(user);
                    res.status(201).json({ token: accessToken, userProfile: user, message: 'Successfully registered' });
                })
                .catch(error => {
                    console.log(error);
                    res.json({ message: 'An error ocurred' });
                });
        }
    });
}


const login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(async user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, async (err, result) => {
                    1
                    if (err) {
                        res.json({ error: err });
                    }
                    if (result) {
                        // Create token
                        const accessToken = jwt.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT_KEY, {
                            expiresIn: '3600s'
                        });

                        // Save user info
                        const accounts = await Account.find({ userId: user._id });
                        const transactions = await Transaction.find({ userId: user._id });
                        const billsToPay = await BillToPay.find({ userId: user._id });

                        // Organize accounts and transactions
                        const organizedAccounts = await Promise.all(
                            accounts.map(async (account) => {
                                const transactions = await Transaction.find({ accountId: account._id });
                                return {
                                    ...account.toObject(),
                                    transactions
                                };
                            })
                        );

                        let userInfo = {
                            _id: user._id,
                            email: user.email,
                            username: user.username,
                            accounts: organizedAccounts,
                            // transactions: transactions,
                            bills_to_pay: billsToPay
                        };

                        // Successfully
                        console.log(`User: ${user.email} is signed`)

                        res.json({ token: accessToken, userInfo: userInfo, message: 'Successfully signed' });
                        next();
                    } else {
                        res.json({ message: 'Password is wrong!' });
                    }
                });
            } else {
                console.log('user not found');
                res.json({ message: 'User not found' });
            }
        });
};


module.exports = {
    register, login
}