const router = require("express").Router();

router.get("/", (req,res) => {
	res.render("index");
});

router.get("/app/ask-gemini", (req,res) => {
	
});

module.exports = router;
module.exports.default = router;