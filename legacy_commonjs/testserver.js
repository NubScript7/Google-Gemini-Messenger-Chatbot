const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
	console.log(req.body);
	res.sendStatus(200);
});

app.post("/", (req, res) => {
	console.log(req.body);
	res.sendStatus(200);
});

app.post("/message", (req, res) => {
	console.log("\x1b[32m OUTPUT \x1b[0m", req.body?.message?.text || req.body);
	res.sendStatus(200);
});

function listen(port = 2468) {
	app.listen(port, () => {
		console.log("test server running at port "+port);
	});
}

if(require.main === module) {
	return listen();
}

module.exports = {
	app,
	listen
};

module.exports.default = {
	app,
	listen
};