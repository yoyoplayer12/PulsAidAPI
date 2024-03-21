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
    timestamp: {
        type: String,
    },
    extraInfo: {
        type: String,
        required: false
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
            required: false
        }
    }

});

//export the model to use in index.js
const Emergency = mongoose.model('Emergency', EmergencySchema);
module.exports = Emergency;
