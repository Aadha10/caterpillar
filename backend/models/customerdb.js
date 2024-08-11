const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const custSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    customerid: {
        type: Number
    },
    city: {
        type: String
    },
    contactno:{
        type: Number
    },
    truckserial:{
        type: String
    },
    truckmodel: {
        type: Number
    }
});
module.exports = mongoose.model('Customer', custSchema);