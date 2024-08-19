const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

const inspSchema = new Schema({
    truckserial: {
        type: Number,
        required: true
    },
    inspid: {
        type: Number,
        required: true
    },
    inspempid: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    custid: {
        type: Number,
        required: true
    },
    responses: [responseSchema],  // Array of responses
    timestamp: {
        type: Date,
        default: Date.now  // To track when the inspection was conducted
    }
});

module.exports = mongoose.model('Inspection', inspSchema);
