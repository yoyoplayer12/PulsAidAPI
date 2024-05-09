const e = require('express');
const Conversation = require('../../../models/Conversation.js');
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
    let emergency = await Emergency.findById(req.params.id);
    res.json({ 
        status: 200,
        emergency: emergency
    });
};



module.exports = {
    index,
    create,
    show
};