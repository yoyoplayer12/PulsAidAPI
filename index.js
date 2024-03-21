var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose  = require('mongoose');

require('dotenv').config();

var app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const cors = require('cors');


//connect to mongodb
mongoose.connect(process.env.MONGODB);
//check connection 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");




//use cors
app.use(cors());
app.use(express.json());

//import routers
const emergenciesRouter = require('./routes/api/v1/emergencies');

//use the routers
app.use('/api/v1/emergencies', emergenciesRouter);
});

module.exports = app;
