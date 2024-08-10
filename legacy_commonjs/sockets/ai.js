const router = require("express").Router();
const ai = require("../gemini");
const generateToken = require("../token");

const ioHandler = socket => {
	socket.once("__req.ai.session", () => {
		socket.userSessionData = {
			token: generateToken(),
			ip: socket.handshake.address
		};
	});
	
	socket.on("__ask.ai.message", msg => {
		
	});
	
	socket.on("disconnect", () => {
		
	});
};

const init = io => io.on("connection", ioHandler);

module.exports = {
	init,
	router
};

module.exports.default = {
	init,
	router
};