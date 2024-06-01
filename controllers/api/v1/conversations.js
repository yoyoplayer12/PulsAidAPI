const e = require('express');
const Conversation = require('../../../models/Conversation.js');
const User = require('../../../models/User.js');
require('dotenv').config();


const index = async (req, res) => {
    let conversations = await Conversation.find();
    res.json({ 
        status: 200,
        conversations: conversations
    });
};

const create = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({
            status: 400,
            message: "Request body is missing or is not an object"
        });
    }

    let application = req.body;

    // Convert string dates to Date objects
    let newConversation = new Conversation(application);
    await newConversation.save();
    res.json({
        status: 200,
        message: "conversation created"
    });
};

const show = async (req, res) => {
    let conversation = await Conversation.findById(req.params.id);
    res.json({ 
        status: 200,
        conversation: conversation
    });
};

const showFive = async (req, res) => {
    // take five users with lowest earcount that contain given platform, if there are less than five, take all
    let platform = req.params.platform;
    let query = {};
    query[`contact.${platform}`] = { $ne: "" };

    let users = await User.find(query).sort({earCount: 1}).limit(5);
    res.json({ 
        status: 200,
        users: users
    });

}



module.exports = {
    index,
    create,
    show,
    showFive
};