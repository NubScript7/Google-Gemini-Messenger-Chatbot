"use strict"

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 16384,
  responseMimeType: "text/plain"
};

class Gemini {
  
  #API_KEY
  #CHAT_SESSION
  #genAI
  #model
  #IS_INITIALIZED
  
  constructor() {
    console.log("Created new gemini, proceed to initialize.");
    this.#API_KEY = null;
    this.#CHAT_SESSION = null;
  }
  
  init(apiKey) {
    this.#API_KEY = apiKey;
    this.#genAI = new GoogleGenerativeAI(apiKey);
    this.#model = this.#genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });
    this.#CHAT_SESSION = this.#model.startChat({
      generationConfig,
      history: []
    });
    this.#IS_INITIALIZED = true
  }
  
  ask(message=null) {
    if(!message || message == "" || !this.#IS_INITIALIZED)
      throw new Error("Message was empty or not yet initialized.")
    return new Promise((res,rej) => {
      this.#CHAT_SESSION.sendMessage(message).then(e => res(e.response.text()) )
        .catch(e => rej(e) );
    })
  }
  
  askStream(message) {
    if(!message || message == "" || !this.#IS_INITIALIZED)
      throw new Error("Message was empty or not yet initialized.")
    return new Promise((res, rej) => {
      this.#CHAT_SESSION.sendMessageStream(message).then(e => res(e.stream) )
        .catch(e => rej(e) );
    })
  }
  
}

const ai = new Gemini();

module.exports = ai
module.exports.default = ai