const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmergencySchema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    extraInfo: {
        type: String,
        required: false,
        default: null,
    },
    userId: {
        type: [String],
        required: false
    },
    feedback: {
        weg:{
            type: Number,
            required: false,
            min: 1,
            max: 5,
            default: null,
        },
        gebruiksGemak:{
            type: Number,
            required: false,
            min: 1,
            max: 5,
            default: null,
        },
        feedback:{
            type: String,
            required: false,
            default: null,
        }
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

//export the model to use in index.js
const Emergency = mongoose.model('Emergency', EmergencySchema, "oproepen");
module.exports = Emergency;
