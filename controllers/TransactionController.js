const Transaction = require('../models/TransactionSchema');
const Account = require('../models/AccountSchema');
const BillToPay = require('../models/BillToPay');

const createTransaction = async (req, res) => {
    try {
        const {
            userId,
            accountId,
            description,
            value,
            category,
            type,
            date,
            accountName,
            paid,
        } = req.body;

        // Encontra a conta correspondente
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }

        if (!paid) {
            const newTransaction = new BillToPay({
                userId,
                description,
                value,
                date,
                paid
            });

            const savedTransaction = await newTransaction.save();

            res.status(201).json(savedTransaction);
        } else {

            const newTransaction = new Transaction({
                userId,
                accountId,
                description,
                value,
                category,
                type,
                date,
                accountName,
                paid
            });


            const savedTransaction = await newTransaction.save();

            // Update account balance
            let balance;
            if (type === 'saída') {
                balance = (parseFloat(account.balance.replace(',', '.')) - parseFloat(value.replace(',', '.'))).toFixed(2);
            } else {
                balance = (parseFloat(account.balance.replace(',', '.')) + parseFloat(value.replace(',', '.'))).toFixed(2);
            }

            if (paid === true) {
                const updatedAccount = await Account.findOneAndUpdate(
                    { userId, _id: accountId },
                    { balance },
                    { new: true }
                );

                if (!updatedAccount) {
                    return res.status(404).json({ error: 'Conta não encontrada' });
                }
            }


            res.status(201).json(savedTransaction);
        }

    } catch (error) {
        res.status(500).json({ error: 'Ocorrreu um erro ao criar a conta.' });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { userId, accountId, transactionId } = req.params;
        const account = await Account.findById(accountId);

        const deletedTransaction = await Transaction.findOneAndDelete({
            userId,
            accountId,
            _id: transactionId
        });

        if (deletedTransaction) {
            // Update Account balance
            let balance;
            if (deletedTransaction.type === 'saída') {
                balance = (parseFloat(account.balance.replace(',', '.')) + parseFloat(deletedTransaction.value.replace(',', '.'))).toFixed(2);
            } else {
                balance = (parseFloat(account.balance.replace(',', '.')) - parseFloat(deletedTransaction.value.replace(',', '.'))).toFixed(2);
            }
            await Account.findOneAndUpdate(
                { userId, _id: accountId },
                { balance },
                { new: true }
            );
        }

        // Transação excluída com sucesso
        return res.json({ message: 'Transação excluída com sucesso' });
    } catch (error) {
        console.error('Ocorreu um erro ao excluir a transação:', error);
        return res.status(500).json({ error: 'Ocorreu um erro ao excluir a transação' });
    }
};

const deleteBillToPay = async (req, res) => {
    try {
        const { userId, billToPayId } = req.params;

        const deletedBillToPay = await BillToPay.findOneAndDelete({ 
            userId,
            _id: billToPayId
         });

         return res.json({ message: 'Conta a pagar excluída com sucesso' });
    } catch (error) {
        
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { userId, accountId, transactionId } = req.params;
        const {
            description,
            value,
            category,
            type,
            date,
            paid
        } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { userId, accountId, _id: transactionId, },
            { description, value, category, type, date, paid },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        res.json(transaction);

    } catch (error) {
        console.error('Ocorreu um erro ao atualizar a transação:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar a transação' });
    }
};

const getTransactionByUser = async (req, res) => {
    try {
        const { userId, accountId } = req.params;

        Transaction.find({ userId, accountId })
            .then(transactions => {
                res.json(transactions);
            })
            .catch(error => {
                console.error('Occorreu um erro ao recuperar as transações.', error);
            });
    } catch (error) {

    }
};

const getAllTransactionsByUser = async (req, res) => {
    try {
        const userId = req.params;

        Transaction.find(userId)
            .then(transactions => {
                res.json(transactions);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao recuperar as transações.', error);
            });
    } catch (error) {

    }
}

const getBillToPayByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        BillToPay.find({ userId })
            .then(bills => {
                res.json(bills);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao recuperar as contas à pagar', error);
            });
    } catch (error) {

    }
}

module.exports = {
    createTransaction,
    deleteTransaction,
    deleteBillToPay,
    updateTransaction,
    getTransactionByUser,
    getAllTransactionsByUser,
    getBillToPayByUser
}