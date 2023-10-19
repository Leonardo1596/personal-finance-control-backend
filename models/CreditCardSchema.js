const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const creditCardSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    creditLimit: {
        type: String,
        required: true
    },
    balance: {
        type: String,
        default: "0,00",
    },
    transactions: [transactionsSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

creditCardSchema.methods.updateBalance = function () {
    const totalAmount = this.transactions.reduce((total, transaction) => {
        const transactionValue = parseFloat(transaction.value.replace(',', '.'));
        return total + transactionValue;
    }, 0);
    this.balance = totalAmount.toFixed(2).replace('.', ',');
};

module.exports = mongoose.model('creditCards', creditCardSchema)