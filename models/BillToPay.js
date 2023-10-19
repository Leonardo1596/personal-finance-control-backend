const mongoose = require('mongoose');

const billToPaySchema = mongoose.Schema({
    userId: {
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
    date: {
        type: String,
        required: true
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

module.exports = mongoose.model('bills_to_pays', billToPaySchema)