const e = require('express');
const SideNotification = require('../../../models/SideNotification.js');
const User = require('../../../models/User.js');
require('dotenv').config();
const cron = require('node-cron');



const checkCertificationEndDate = async () => {
    let users = await User.find({ role: 'EHBO' });
    let currentDate = new Date();
    let oneDayFromNow = new Date(currentDate.getTime() + 24*60*60*1000);
    let oneWeekFromNow = new Date(currentDate.getTime() + 7*24*60*60*1000);
    let oneMonthFromNow = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].certifications.length; j++) {
            let certEndDate = new Date(users[i].certifications[j].certification_enddate);
            if (certEndDate < oneDayFromNow) {
                let sideNotification = new SideNotification({
                    user: users[i]._id,
                    description: 'your_certificate_expires_tomorrow',
                    action: 'renew',
                    strong: ['certificate', 'tomorrow'],
                    role: 'EHBO'
                });
                await sideNotification.save();
                if(users[i].notifications !== false){
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
                            headings: {en: 'Certificate expires tomorrow', nl: 'Certificaat loopt morgen af'},
                            contents: {en: 'Renew your certificate now', nl: 'Vernieuw je certificaat nu'},
                            include_aliases: {
                                external_id: [users[i]._id]
                            },
                            target_channel: 'push',
                        })
                    };
                    fetch(url, options)
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.log('error', error));
                }
            }else if(certEndDate < oneWeekFromNow){
                let sideNotification = new SideNotification({
                    user: users[i]._id,
                    description: 'your_certificate_expires_in_1_week',
                    action: 'renew',
                    strong: ['certificate', '1', 'week'],
                    role: 'EHBO'
                });
                await sideNotification.save();
                if(users[i].notifications !== false){
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
                            headings: {en: 'Certificate expires in 1 week', nl: 'Certificaat loopt over 1 week af'},
                            contents: {en: 'Renew your certificate now', nl: 'Vernieuw je certificaat nu'},
                            include_aliases: {
                                external_id: [users[i]._id]
                            },
                            target_channel: 'push',
                        })
                    };
                    fetch(url, options)
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.log('error', error));
                }
            }else if(certEndDate < oneMonthFromNow){
                let sideNotification = new SideNotification({
                    user: users[i]._id,
                    description: 'your_certificate_expires_in_1_month',
                    action: 'renew',
                    strong: ['certificate', '1', 'month'],
                    role: 'EHBO'
                });
                await sideNotification.save();
                if(users[i].notifications !== false){
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
                            headings: {en: 'Certificate expires in 1 month', nl: 'Certificaat loopt over 1 maand af'},
                            contents: {en: 'Renew your certificate now', nl: 'Vernieuw je certificaat nu'},
                            include_aliases: {
                                external_id: [users[i]._id]
                            },
                            target_channel: 'push',
                        })
                    };
                    fetch(url, options)
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.log('error', error));
                }
            }
        }
    };
}

cron.schedule('00 9 * * *', checkCertificationEndDate);


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