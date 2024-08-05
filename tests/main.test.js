/* eslint-env jest */

const $ = require("axios");
const main = require("../main");

test("app should accept and process this request", () => {
	$.post("http://localhost:3000/generative-ai/api/v1/webhook", {
		object: "page",
		entry: [
			{
				messaging: [
					{
						sender: {
							id: 8297504716950349
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
			expect(e.data).toEqual("EVENT_RECEIVED");
		})
		.catch(e => {
			console.error(e.response.data || e);
		});
});

