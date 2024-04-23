const e = require('express');
const Emergency = require('../../../models/Emergency.js');
require('dotenv').config();
const fetch = require('node-fetch');

function formatDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}/${minutes}/${seconds}`;
}

const index = async (req, res) => {
    let emergencies = await Emergency.find();
    res.json({ 
        status: 200,
        emergencies: emergencies
    });
};

const create = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({
            status: 400,
            message: "Request body is missing or is not an object"
        });
    }

    let emergency = req.body;
    emergency.timestamp = formatDate(new Date());
    let newEmergency = new Emergency(emergency);
    await newEmergency.save();
    const url = 'https://api.onesignal.com/notifications';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            Authorization: 'Basic ' + process.env.ONESIGNAL_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            app_id: process.env.ONESIGNAL_APP_ID,
            headings: {en: 'Emergency Alert Title', nl: 'Noodgeval Alert Titel'},
            contents: {en: 'An emergency has been reported', nl: 'Er is een noodgeval gemeld'},
            //possible location fix
            // filters: [
            //     {"field": "location", "radius": "500", "lat": emergency.latitude, "long": emergency.longitude}
            // ],
            // data: {longitude: emergency.longitude, latitude: emergency.latitude, extraInfo: emergency.extraInfo}
            included_segments: ['All']
        })
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    res.json({
        status: 200,
        message: "Emergency created"
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