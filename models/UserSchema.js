const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: 'string',
        required: true
    },
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    // accounts: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'accounts'
    // }],
    // bills_to_pay: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'bills_to_pays'
    // }]
});


module.exports = mongoose.model('users', userSchema)