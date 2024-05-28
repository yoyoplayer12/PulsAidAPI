var express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;

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

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});

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

module.exports = app;