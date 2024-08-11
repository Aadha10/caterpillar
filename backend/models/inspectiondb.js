const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inspSchema = new Schema({
    truckserial:{
        type: Number
    },
    inspid: {
        type: Number
    },
    inspempid: {
        type: Number
    },
    date: {
        type: Date
    },
    custid:{
        type: Number
    }
});
module.exports = mongoose.model('Inspection', inspSchema);