const e = require('express');
const Availability = require('../../../models/Availability.js');
require('dotenv').config();


const index = async (req, res) => {
    let availability = await Availability.find();
    res.json({ 
        status: 200,
        availability: availability
    });
};

const create = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({
            status: 400,
            message: "Request body is missing or is not an object"
        });
    }

    let availability = req.body;

    // Convert string dates to Date objects

    let newAvailability = new Availability(availability);
    await newAvailability.save();
    res.json({
        status: 200,
        message: "availability created"
    });
};





module.exports = {
    index,
    create,
};