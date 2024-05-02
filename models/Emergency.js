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
    userId: {
        type: [String],
        required: false
    },
    feedback: {
        way:{
            type: Number,
            required: false,
            min: 1,
            max: 5,
        },
        usability:{
            type: Number,
            required: false,
            min: 1,
            max: 5,
        },
        feedback:{
            type: String,
            required: false,
        }
    },
    extraInfo: {
        type: String,
        required: false,
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
});

//export the model to use in index.js
const Emergency = mongoose.model('Emergency', EmergencySchema, "oproepen");
module.exports = Emergency;
