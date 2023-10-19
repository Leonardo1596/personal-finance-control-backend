const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    balance: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model('accounts', accountSchema)