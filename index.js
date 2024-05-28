var express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
const WebSocket = require('ws');
const Emergency = require('./models/Emergency.js');

// Enable CORS
app.use(cors());

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
});


    const emergencyRouter = require("./routes/api/v1/emergencies.js");
    app.use(express.json());
    app.use("/api/v1/emergencies", emergencyRouter);






    // WebSocket server
    const wss = new WebSocket.Server({ noServer: true });
    //add websocket to global object
    global.wss = wss;
    wss.on('connection', async (ws) => {
        console.log('connected');

        try {
            // Query the database for all messages
            const emergencies = await Emergency.find({ removed: false });

            // Send each message to the client
            emergencies.forEach(message => {
                ws.send(JSON.stringify(message));
            });
        } catch (err) {
            console.error(err);
        }

        ws.on('message', (message) => {
            console.log('received: %s', message);
        });
    });




    const server = app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });













// 	app.listen(port, () => {
// 		console.log(`Example app listening on port ${port}`);
// 	});





// 	//import routers
// 	const emergenciesRouter = require("./routes/api/v1/emergencies");
// 	const usersRouter = require("./routes/api/v1/users");
// 	const conversationsRouter = require("./routes/api/v1/conversations");
// 	const availibilitiesRouter = require("./routes/api/v1/availibilities");
// 	const sidenotificationsRouter = require("./routes/api/v1/sideNotifications");
// 	//use the routers
// 	app.use("/api/v1/emergencies", emergenciesRouter);
// 	app.use("/api/v1/users", usersRouter);
// 	app.use("/api/v1/conversations", conversationsRouter);
// 	app.use("/api/v1/availibilities", availibilitiesRouter);
// 	app.use("/api/v1/sideNotifications", sidenotificationsRouter);


// module.exports = app;