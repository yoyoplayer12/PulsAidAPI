const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let dateStr = Date.now();
let parts = dateStr.split(" ");
let dateParts = parts[0].split("-");
let timeParts = parts[1].split(":");
let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);

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
        weg:{
            type: Number,
            required: false,
            min: 1,
            max: 5,
        },
        gebruiksGemak:{
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
        type: Date,
        default: date,
    },
});

//export the model to use in index.js
const Emergency = mongoose.model('Emergency', EmergencySchema, "oproepen");
module.exports = Emergency;
