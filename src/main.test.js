const express = require("express")
const app	= express()
const $ = require("axios")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const	main = require("./main")

app.get("/", (req,res) => {
	console.log(req.body)
})

const testPort = 2468;

const testServer = app.listen(testPort)

main.net.output = `http://localhost:${testPort}`

const totalTests = 1;
let ranTests = 0;

const dummyFunc = () => {};
const incrementTestCount = () => ranTests++;

console.log({testPort})



test("app should accept and process this request", () => {
	$.post(`http://localhost:3000/webhook`,{
		object: "page",
		entry: [
			{
				messaging: [
					{
						sender: {
							id: 123
						},
						message: {
							text: "what is c++"
						}
					}
				]
			}
		]
	})
	.then(e => {
		expect(e.data)
			.toEqual("EVENT_RECEIVED")
		incrementTestCount()
	}).catch(incrementTestCount)
})

const interval = setInterval(() => {
	if(ranTests >= totalTests){
		clearInterval(interval)
		testServer.close()
	}
}, 1000)