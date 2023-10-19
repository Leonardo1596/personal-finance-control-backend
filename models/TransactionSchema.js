const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
    },
    paid: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

module.exports = mongoose.model('transactions', transactionsSchema)