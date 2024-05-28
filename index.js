const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { Server } = require('socket.io');
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);
const Emergency = require('./models/Emergency'); // Correctly import the Emergency model

io.on('connection', (socket) => {
    socket.on('getHelperNumber', async (message) => {
        try {
            const { emergencyId } = message;

            if (!emergencyId) {
                socket.emit('helperNumberError', { status: 400, message: "Invalid emergency ID" });
                return;
            }

            let emergency = await Emergency.findById(emergencyId);
            if (emergency) {
                const data = {
                    status: 200,
                    helpers: emergency.userId.length
                };
                socket.emit('helperNumber', data);
            } else {
                const data = {
                    status: 404,
                    message: "Emergency not found"
                };
                socket.emit('helperNumberError', data);
            }
        } catch (error) {
            socket.emit('helperNumberError', { status: 500, message: error.message });
        }
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const credentials = "/etc/secrets/credentials.pem";
mongoose.connect(
    "mongodb+srv://pulsaid.ooraany.mongodb.net/app?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=PulsAid",
    {
        tlsCertificateKeyFile: credentials,
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
    app.use(cors());
    app.use(express.json());

    const emergenciesRouter = require("./routes/api/v1/emergencies");
    const usersRouter = require("./routes/api/v1/users");
    const conversationsRouter = require("./routes/api/v1/conversations");
    const availibilitiesRouter = require("./routes/api/v1/availibilities");
    const sidenotificationsRouter = require("./routes/api/v1/sideNotifications");

    app.use("/api/v1/emergencies", emergenciesRouter);
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/conversations", conversationsRouter);
    app.use("/api/v1/availibilities", availibilitiesRouter);
    app.use("/api/v1/sideNotifications", sidenotificationsRouter);
});

module.exports = { app, io };
