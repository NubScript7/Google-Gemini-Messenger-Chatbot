const $ = require("axios")
const	main = require("./main")

const totalTests = 1;
let ranTests = 0;

const dummyFunc = () => {};
const incrementTestCount = () => ranTests++;


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


/*
const interval = setInterval(() => {
	if(ranTests >= totalTests){
		clearInterval(interval)
		testServer.close()
	}
}, 1000)

*/