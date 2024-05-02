const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailablitySchema = new Schema({
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    user: {
        type: String,
    },
    repeat:{
        type: String,
        required: true
    },
});

const Availibility = mongoose.model('Availibility', AvailablitySchema, "availibility");
module.exports = Availibility;
