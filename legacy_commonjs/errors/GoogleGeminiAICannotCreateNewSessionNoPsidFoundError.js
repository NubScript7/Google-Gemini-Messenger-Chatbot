class GoogleGeminiAICannotCreateNewSessionNoPsidFoundError extends Error {
    constructor(message)
    {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = GoogleGeminiAICannotCreateNewSessionNoPsidFoundError;
