const e = require('express');
const User = require('../../../models/User.js');
const bcrypt = require('bcrypt');

const index = async (req, res) => {
    let users = await User.find();
    res.json({ 
        status: 200,
        users: users
    });
}

const create = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({
            status: 400,
            message: "Request body is missing or is not an object"
        });
    }

    let user = req.body;
    user.password = await bcrypt.hash(user.password, 10);

    // Convert string dates to Date objects
    user.dob = convertDate(user.dob);
    if(user.certification_begindate && user.certification_enddate){
    user.certification_begindate = convertDate(user.certification_begindate);
    user.certification_enddate = convertDate(user.certification_enddate);
    }

    let newUser = new User(user);
    await newUser.save();
    res.json({
        status: 200,
        message: "User created"
    });
};

function convertDate(inputFormat) {
    let parts = inputFormat.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
const show = async (req, res) => {
    let user = await User.findById(req.params.id);
    res.json({ 
        status: 200,
        user: user
    });
};

const login = async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return res.status(401).json({
            status: 401,
            message: "Email not found"
        });
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({
            status: 401,
            message: "Password is incorrect"
        });
    }
    res.json({
        status: 200,
        message: "Login successful"
    });
}

module.exports = {
    index,
    create,
    show,
    login
};
