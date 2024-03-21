var express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;


// Enable CORS
app.use(cors());

// Check connection 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
    app.use(cors());

    const server = app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });

    const cors = require('cors');

    // Connect to MongoDB (add slash for web)
    const credentials = "etc/secrets/credentials.pem";
    mongoose.connect("mongodb+srv://pulsaid.ooraany.mongodb.net/app?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=PulsAid", {
        
        tlsCertificateKeyFile: credentials,
    });
    app.use(express.json());

    //import routers
    const emergenciesRouter = require('./routes/api/v1/emergencies');
    //use the routers
    app.use('/api/v1/emergencies', emergenciesRouter);
});

module.exports = app;
