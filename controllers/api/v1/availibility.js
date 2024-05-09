const e = require('express');
const Availability = require('../../../models/Availibility.js');
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

const show = async (req, res) => {
let availability = await Availability.find({ user: req.params.id });    
res.json({
        status: 200,
        availability: availability
    });
}


module.exports = {
    index,
    create,
    show
};