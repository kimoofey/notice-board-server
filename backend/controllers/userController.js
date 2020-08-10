const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
};

const userSchema = new Schema(fields);

module.exports = mongoose.model('users', userSchema);