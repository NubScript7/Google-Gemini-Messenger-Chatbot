const { it, assertions } = require("../tester");

const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});
const { GeminiSession, geminiSettings } = require("../gemini");

const id = 7493; //id of user, can use any number
//initialization

assertions(3);

geminiSettings.init(process.env.GOOGLE_GEMINI_API_KEY).then(e => { //should return true if initialized
	it("it should initialize", expect => {
		expect(e).toStrictEqual(true);
	});
	
	const gemini = new GeminiSession(id);
	gemini.createSession();
	
	gemini.ask("say 'hello world!'").then(e => {
		it("should response as asked", expect => {
			expect(e).toStrictTypeEqual("string");
		});
	});
	
	geminiSettings.askOnce("say 'hello world!'").then(e => {
		it("should be able to ask without creating a new session", expect => {
			expect(e).toStrictTypeEqual("string");
		});
	});
	
});




/*
//jest testing, although un-usable cause i cant mock @google/generative-ai fetch request,
//so i need to call real api
//initialization
const id = 7493; //id of user, can use any number

jest.useFakeTimers()

describe("Gemini module should work", () => {
	expect.assertions(5)
	
	it("should initialize", async () => {
		const result = await geminiSettings.init(process.env.GOOGLE_GEMINI_API_KEY)
		expect(result).toEqual(true)
	})
	
	const gemini = new GeminiSession(id)
	
	it("should be able to create a new chat session", () => {
		gemini.createSession()
		setTimeout(() => expect(gemini.hasSession()).toEqual(true), 1000)
	})
	
	it("should be able to ask without creating a session", async () => {
		const result = await geminiSettings.askOnce("say 'hello world!'")
		expect(typeof result).toBe("string")
	})
	
	it("should return null if we ask without giving a message", () => {
		const result = geminiSettings.askOnce()
		expect(result).toBe(null)
	})
	
	setTimeout(() => {
		it("should be able to ask gemini", async () => {
			const result = await gemini.ask("say 'hello world!'");
			expect(typeof result).toBe("string")
		})
	},1500) // wait a little while creating a new session
	
	jest.runAllTimers()
})
*/