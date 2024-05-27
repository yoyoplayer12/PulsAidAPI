var express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { Server } = require('socket.io');
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);
const { Emergency } = require('./models');


io.on('connection', (socket) => {
    socket.on('getHelperNumber', async (message) => {
        const { emergencyId } = JSON.parse(message);

        let emergency = await Emergency.findById(emergencyId);
        if (emergency) {
            // Prepare the data to be sent
            const data = {
                status: 200,
                helpers: emergency.userId.length
            };

            // Emit 'helperNumber' event with the data
            socket.emit('helperNumber', data);
        } else {
            // Prepare the data to be sent
            const data = {
                status: 404,
                message: "Emergency not found"
            };

            // Emit 'helperNumberError' event with the data
            socket.emit('helperNumberError', data);
        }
    });
});



server.listen(port, () => console.log(`Listening on port ${port}`));

// Connect to MongoDB (add slash for web)
const credentials = "/etc/secrets/credentials.pem";
mongoose.connect(
    "mongodb+srv://pulsaid.ooraany.mongodb.net/app?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=PulsAid",
    {
        tlsCertificateKeyFile: credentials,
    }
);

// Check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
    app.use(cors());

    // Enable CORS
    app.use(cors());

    app.use(express.json());

    //import routers
    const emergenciesRouter = require("./routes/api/v1/emergencies");
    const usersRouter = require("./routes/api/v1/users");
    const conversationsRouter = require("./routes/api/v1/conversations");
    const availibilitiesRouter = require("./routes/api/v1/availibilities");
    const sidenotificationsRouter = require("./routes/api/v1/sideNotifications");
    //use the routers
    app.use("/api/v1/emergencies", emergenciesRouter);
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/conversations", conversationsRouter);
    app.use("/api/v1/availibilities", availibilitiesRouter);
    app.use("/api/v1/sideNotifications", sidenotificationsRouter);
});

module.exports = { app, io }; // Export both app and io