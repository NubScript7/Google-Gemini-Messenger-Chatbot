class GoogleGeminiGenerativeAIApiKeyNotSetError extends Error {
    constructor(message)
    {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = GoogleGeminiGenerativeAIApiKeyNotSetError;
