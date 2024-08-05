"use strict";

const {
	GoogleGenerativeAI
} = require("@google/generative-ai");

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 1024,
	responseMimeType: "text/plain"
};

//Errors

//const UndefinedValueRequestedFromGeminiSettingsError = require("./errors/UndefinedValueRequestedFromGeminiSettingsError");
const GoogleGeminiGenerativeAINotYetInitializedError = require("./errors/GoogleGeminiGenerativeAINotYetInitializedError");
const GeminiAISpecifiedMaxSessionsReachedError = require("./errors/GeminiAISpecifiedMaxSessionsReachedError");
const GoogleGeminiGenerativeAISessionAlreadyInitializedError = require("./errors/GoogleGeminiGenerativeAISessionAlreadyInitializedError");
const GoogleGeminiGenerativeAISessionNotYetInitializedError = require("./errors/GoogleGeminiGenerativeAISessionNotYetInitializedError");
const GeminiAINotYetInitializedOrMessageWasEmptyError = require("./errors/GeminiAINotYetInitializedOrMessageWasEmptyError");
const GoogleGeminiGenerativeAIApiKeyNotSetError = require("./errors/GoogleGeminiGenerativeAIApiKeyNotSetError");
const GoogleGeminiAICannotCreateNewSessionNoPsidFoundError = require("./errors/GoogleGeminiAICannotCreateNewSessionNoPsidFoundError");
const GoogleGeminiGenerativeAIFailedToInitializeError = require("./errors/GoogleGeminiGenerativeAIFailedToInitializeError");

class GeminiSettings {
	#API_KEY = null;
	#genAI = null;
	#model = null;
	#INITIALIZED = false;
	#MAXSESSIONS = 10;
	#psids;
	
	constructor() {
		this.#API_KEY = null;
		this.#genAI = null;
		this.#model = null;
		this.#INITIALIZED = false;
		this.#MAXSESSIONS = 10;
		this.#psids = new Set();
	}
	
	isInitialized() {
		return this.#INITIALIZED;
	}
	
	init(apiKey) {
		return new Promise(res => {
				if(!apiKey)
					throw new GoogleGeminiGenerativeAIApiKeyNotSetError("Cannot initialized gemini settings, no api key was specified.");
				if(this.isInitialized())
					return console.warn("Gemini already initialized, cancelling initialization.");
			try {
				this.#API_KEY = apiKey;
				this.#genAI = new GoogleGenerativeAI(this.#API_KEY);
				this.#model = this.#genAI.getGenerativeModel({
					model: "gemini-1.5-pro"
				});
				this.#INITIALIZED = true;
				res(this.#INITIALIZED);
			} catch (err) {
				throw new GoogleGeminiGenerativeAIFailedToInitializeError("google gemini failed to initialize.\n\ncause: "+err.message);
			}
		});
	}
	
	askOnce(msg) {
		if(!msg)
			return null;
		return new Promise(async (res,rej) => {
			try {
				const result = await this.#model.generateContent(msg);
				res(result.response.text());
			} catch (e) {
				rej(e);
			}
		});
	}
	
	test() {
		return this.#model.startChat.toString();
	}
	
	requestSession(psid) {
		if(!psid || isNaN(psid))
			throw new GoogleGeminiAICannotCreateNewSessionNoPsidFoundError("Cannot create a new chat session, no psid was given.");
		if(!this.#INITIALIZED)
			throw new GoogleGeminiGenerativeAINotYetInitializedError("Cannot create a new chat session, not yet initialized.");
		if(this.#psids.size >= this.#MAXSESSIONS)
			throw new GeminiAISpecifiedMaxSessionsReachedError("Cannot create a new session, max sessions has been reached.");
		
		this.#psids.add(psid);
		return this.#model.startChat({
			generationConfig,
			history: []
		});
	}
	
	requestDestroySession(psid) {
		this.#psids.delete(psid);
	}
	
}

const geminiSettings = new GeminiSettings();


// Thinking to reuse session after it got destroyed
class GeminiSession {

	#session;
	#psid;
	
	constructor(psid) {
		if(!psid || isNaN(psid))
			throw new GoogleGeminiAICannotCreateNewSessionNoPsidFoundError("Cannot create a new chat session, no psid was given.");
		this.#session = null;
		this.#psid = psid;
	}
	
	hasSession() {
		return null !== this.#session;
	}
	
	createSession() {
		if(this.hasSession())
			throw new GoogleGeminiGenerativeAISessionAlreadyInitializedError("Cannot create a new session, a previous session was already created.");
		return new Promise(async (res,rej) => {
			try {
				this.#session = geminiSettings.requestSession(this.#psid);
				res(true);
			} catch (err) {
				rej(err);
			}
		});
	}
	
	destroySession() {
		geminiSettings.requestDestroySession(this.#psid);
		this.#psid == null;
		this.#session == null;
	}
	
	wipeSession() {
		this.#session = null;
		this.createSession();
	}
	
	gethistory() {
		if(!this.hasSession())
			throw new GoogleGeminiGenerativeAISessionNotYetInitializedError("Cannot get user session history, not yet initialized.");
		return this.#session.params.history;
	}
	
	ask(message = null) {
		if (!message || message == "" || "object" !== typeof this.#session)
			throw new GeminiAINotYetInitializedOrMessageWasEmptyError("Message was empty or gemini not yet initialized.");
		return new Promise((res, rej) => {
			this.#session.sendMessage(message)
				.then(e => res(e.response.text()))
				.catch (e => rej(e));
		});
	}
	
	askStream(message=null) {
		if (!message || message == "" || "object" !== typeof this.#session)
			throw new GeminiAINotYetInitializedOrMessageWasEmptyError("Message was empty or gemini not yet initialized.");
		return new Promise((res, rej) => {
			this.#session.sendMessageStream(message)
				.then(e => res(e.stream))
				.catch (e => rej(e));
		});
	}
	
	
}

module.exports = {
	GeminiSession,
	geminiSettings
};
module.exports.default = {
	GeminiSession,
	geminiSettings
};