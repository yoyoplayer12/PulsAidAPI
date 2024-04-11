const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    certification: {
        type: String,
        required: true
    },
    certification_type: {
        type: String,
        required: true
    },
    certification_begindate: {
        type: Date,
    },
    certification_enddate: {
        type: Date,
    },
    certification_number: {
        type: String,
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
});

//export the model to use in index.js
const User = mongoose.model('User', UserSchema, "users");
module.exports = User;