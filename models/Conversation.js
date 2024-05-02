const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    applicant: {
        type: String,
        required: true
    },
    applicantContact: {
        type: String,
        required: true
    },
    responder: {
        type: String,
    },
    option:{
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
});

const Conversation = mongoose.model('Conversation', ConversationSchema, "conversations");
module.exports = Conversation;
