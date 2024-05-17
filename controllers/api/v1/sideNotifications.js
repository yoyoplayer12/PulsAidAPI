const e = require('express');
const SideNotification = require('../../../models/SideNotification.js');
require('dotenv').config();


const index = async (req, res) => {
    let sideNotification = await sideNotification.find();
    res.json({ 
        status: 200,
        sideNotification: sideNotification
    });
};


const show = async (req, res) => {
    let sideNotification = await SideNotification.find({ user: req.params.id });
    res.json({ 
        status: 200,
        sideNotification: sideNotification
    });
};



module.exports = {
    index,
    show
};