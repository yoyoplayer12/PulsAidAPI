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
    user.certifications.forEach((cert) => {    
    if(cert.certification_begindate && cert.certification_enddate){
        cert.certification_begindate = convertDate(cert.certification_begindate);
        cert.certification_enddate = convertDate(cert.certification_enddate);
    }
    });

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
        message: "Login successful",
        id: user._id,
        language: user.language
    });
}

const checkEmail = async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        return res.status(401).json({
            status: 401,
            message: "Email already exists"
        });
    }
    res.json({
        status: 200,
        message: "Email is available"
    });
}

const uploadCertificate = async (req, res) => {
    let user = await User.findById(req.params.id);
    req.body.certification_begindate = convertDate(req.body.certification_begindate);
    req.body.certification_enddate = convertDate(req.body.certification_enddate);
    user.certifications.push(req.body);
    await user.save();
    res.json({
        status: 200,
        message: "Certificate uploaded"
    });
}

const updateCertificate = async (req, res) => {
    let user = await User.findById(req.params.id);
    let cert = user.certifications.id(req.params.certificateId);
    if(req.body.certification_begindate && req.body.certification_enddate){
    req.body.certification_begindate = convertDate(req.body.certification_begindate);
    req.body.certification_enddate = convertDate(req.body.certification_enddate);
    }
    cert.set(req.body);
    await user.save();
    res.json({
        status: 200,
        message: "Certificate updated",
        user: user
    });
}

const update = async (req, res) => {
    let user = await User.findById(req.params.id);
    if(req.body.dob){
    req.body.dob = convertDate(req.body.dob);
    }
    if(req.body.password){
    req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    user.set(req.body);
    await user.save();
    res.json({
        status: 200,
        message: "User updated"
    });
}

const destroy = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({
        status: 200,
        message: "User deleted"
    });
}

const recovery = async (req, res) => {
    let user = await User.findOne({
        email: req.params.id
    });

    user.set(req.body);
    await user.save();
    res.json({
        status: 200,
        message: "User updated"
    });
}

module.exports = {
    index,
    create,
    show,
    login,
    checkEmail,
    uploadCertificate,
    updateCertificate,
    update,
    destroy,
    recovery
};
