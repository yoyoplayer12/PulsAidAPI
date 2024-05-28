const e = require('express');
const Emergency = require('../../../models/Emergency.js');
const User = require('../../../models/User.js');
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
            name: 'PulsAid notification',
            headings: {en: 'Someone is dying!', nl: 'Iemand is aan het sterven!'},
            contents: {en: 'Quickly, click me to save a life', nl: 'Klik snel om een leven te redden'},
            // possible location fix
            filters: [
                {"field": "location", "radius": "10000", "lat": emergency.latitude, "long": emergency.longitude} // 10 km radius
            ],
            data: {longitude: emergency.longitude, latitude: emergency.latitude, extraInfo: emergency.extraInfo, route: '/emergency/' + newEmergency._id, emergencyId: newEmergency._id, helpers: emergency.userId},
        })
    };


    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let deviceIds = data.external_id;
            newEmergency.deviceIds = deviceIds;
            newEmergency.save();
        })
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

const update = async (req, res) => {
    let emergency = await Emergency.findById(req.params.id);
    if (emergency) {
        emergency.feedback = req.body.feedback;
        await emergency.save();
        res.json({
            status: 200,
            message: "Emergency updated"
        });
    } else {
        res.status(404).json({
            status: 404,
            message: "Emergency not found"
        });
    }
};

const amount = async (req, res) => {
    let count = await Emergency.countDocuments({ userId: req.params.id });
    res.json({ 
        status: 200,
        amount: count
    });
};

const addHelper = async (req, res) => {
    let emergency = await Emergency.findById(req.params.id);
    let user = await User.findById(req.body.userId);
    let userId = req.body.userId;
    if (emergency) {
        await Emergency.updateOne(
            { _id: req.params.id },
            { $addToSet: { userId: userId } }
        );
        await emergency.save();
        console.log('Added helper to emergency');
        console.log(emergency.deviceIds);
        if(user){
            user.emergencies.push(req.params.id);
            await user.save();
            console.log('Added emergency to user');
            const numberOfUsers = emergency.userId.length;
            const payload = {
                app_id: process.env.ONESIGNAL_APP_ID,
                include_aliases: {
                    external_id: [emergency.deviceIds]
                },
                target_channel: 'push',
                data: { userCount: numberOfUsers },
                content_available: true
                
            };
            
            const notificationUrl = 'https://api.onesignal.com/notifications';
            const notificationOptions = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Basic ' + process.env.ONESIGNAL_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            };

            fetch(notificationUrl, notificationOptions)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error));
            res.json({
                status: 200,
                message: "Emergency added to user and helper added to emergency"
            });
        } else {
            console.log('User not found');
            res.json({
                status: 404,
                message: "User not found"
            });
        }
    } else {
        console.log('Emergency not found');
        res.status(404).json({
            status: 404,
            message: "Emergency not found"
        });
    }
};


const getHelpernumberByEmergencyId = async (req, res) => {
    let emergency = await Emergency.findById(req.params.id);
    if(emergency){
        res.json({
            status: 200,
            amount: emergency.userId.length
        });
    } else {
        res.status(404).json({
            status: 404,
            message: "Emergency not found"
        });
    }
};

module.exports = {
    index,
    create,
    show,
    update,
    amount,
    addHelper,
    getHelpernumberByEmergencyId
};