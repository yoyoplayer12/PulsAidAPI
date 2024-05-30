const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SideNotificationSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    strong: [{
        type: String,
        required: true
    }],
    action: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
});

const SideNotification = mongoose.model('SideNotification', SideNotificationSchema, "sidenotifications");
module.exports = SideNotification;