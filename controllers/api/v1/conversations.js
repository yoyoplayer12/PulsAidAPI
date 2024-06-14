const e = require("express");
const Conversation = require("../../../models/Conversation.js");
const User = require("../../../models/User.js");
require("dotenv").config();

const index = async (req, res) => {
	let conversations = await Conversation.find();
	res.json({
		status: 200,
		conversations: conversations,
	});
};

const create = async (req, res) => {
	if (typeof req.body !== "object" || req.body === null) {
		return res.status(400).json({
			status: 400,
			message: "Request body is missing or is not an object",
		});
	}

	let application = req.body;

	// Convert string dates to Date objects
	let newConversation = new Conversation(application);
	await newConversation.save();
	res.json({
		status: 200,
		message: "conversation created",
	});
};

const show = async (req, res) => {
	let conversation = await Conversation.findById(req.params.id);
	res.json({
		status: 200,
		conversation: conversation,
	});
};

const showFive = async (req, res) => {
	try {
		let platform = req.params.platform;
		let helpuserId = req.params.helpuserId;
		let query = {};
		query[`contact.${platform}`] = { $ne: "" };
		let users = await User.find(query).sort({ earCount: 1 }).limit(5);
		console.log("USERSSS: " + users);
		users.forEach((user) => {
			try {
				const url = "https://api.onesignal.com/notifications";
				const options = {
					method: "POST",
					headers: {
						accept: "application/json",
						Authorization: "Basic " + process.env.ONESIGNAL_API_KEY,
						"content-type": "application/json",
					},
					body: JSON.stringify({
						app_id: process.env.ONESIGNAL_APP_ID,
						include_external_user_ids: [user._id.toString()],
						headings: { en: "Someone needs your help", nl: "Iemand heeft je hulp nodig" },
						contents: {
							en: helpuserId + " wants to talk to you on " + platform,
							nl: helpuserId + " wil met je praten op " + platform,
						},
						data: { platform: platform, helpuserId: helpuserId },
					}),
				};
				fetch(url, options)
					.then((response) => response.json())
					.then((data) => {
						if (data.errors && data.errors.includes("All included players are not subscribed")) {
							console.log(`User ${user._id} is not subscribed to notifications`);
						} else {
							console.log(data);
						}
					});
			} catch (error) {
				console.log(`Error processing user ${user._id}: ${error}`);
			}
		});
		res.json({
			status: 200,
			users: users,
		});
	} catch (error) {
		console.error("error" + error);
		res.status(500).json({
			status: 500,
			message: "Internal server error",
		});
	}
};
const sendNotificationToUser = async (userid, platform) => {
	try {
		const url = "https://api.onesignal.com/notifications";
		const options = {
			method: "POST",
			headers: {
				accept: "application",
				Authorization: "Basic " + process.env.ONESIGNAL_API_KEY,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				app_id: process.env.ONESIGNAL_APP_ID,
				include_external_user_ids: [userid.toString()],
				headings: { en: "Someone needs your help", nl: "Iemand heeft je hulp nodig" },
				contents: {
					en: userid + " wants to talk to you on " + platform,
					nl: userid + " wil met je praten op " + platform,
				},
				data: { platform: platform, userid: userid },
			}),
		};
		fetch(url, options)
			.then((response) => response.json())
			.then((data) => {
				if (data.errors && data.errors.includes("All included players are not subscribed")) {
					console.log(`User ${userid} is not subscribed to notifications`);
				} else {
					console.log(data);
				}
			});
	} catch (error) {
		console.log(`Error processing user ${userid}: ${error}`);
	}
};

module.exports = {
	index,
	create,
	show,
	showFive,
    sendNotificationToUser
};
