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
	//use the routers
	app.use("/api/v1/emergencies", emergenciesRouter);
	app.use("/api/v1/users", usersRouter);
});

module.exports = app;
