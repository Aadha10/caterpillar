const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    employeeid: {
        type: Number
    },
    city: {
        type: String
    },
    contactno:{
        type: Number
    },
    date: {
        type: Date
    }
});
module.exports = mongoose.model('Worker', workerSchema);