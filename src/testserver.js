const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req) => {
	console.log(req.body)
})

app.post("/", (req) => {
	console.log(req.body)
})

app.listen(2468, () => {
	console.log("test server running at port 2468")
})