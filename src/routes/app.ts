import { Router } from "express";

const router = Router();

router.get("/", (req,res) => {
	res.redirect("/app/ask-gemini")
});

router.get("/app/ask-gemini", (req,res) => {
	res.render("index")
});

export default router;