declare class GeminiSettingsApiKeyNotSetError extends Error {
    constructor(message: string);
}
declare class GeminiSettingsInvalidMessageString extends Error {
    constructor(message: string);
}
declare class GeminiSettingsNoIdWasFoundError extends Error {
    constructor(message: string);
}
declare class GeminiSettingsNotYetInitializedError extends Error {
    constructor(message: string);
}
declare class GeminiSettingsSpecifiedMaxSessionsReachedError extends Error {
    constructor(message: string);
}
declare class GeminiSettingsInvalidBotType extends Error {
    constructor(message: string);
}
declare class GeminiSettingsInvalidSystemInstruction extends Error {
    constructor(message: string);
}
declare class GeminiSessionNotAvailableError extends Error {
    constructor(message: string);
}
declare class GeminiSessionAlreadyInitializedError extends Error {
    constructor(message: string);
}
declare class GeminiSessionNotYetInitializedError extends Error {
    constructor(message: string);
}
declare class GeminiSessionNoIdWasFoundError extends Error {
    constructor(message: string);
}
declare class GeminiSessionCannotAskMessageWasEmptyOrNotInitialized extends Error {
    constructor(message: string);
}
declare class ConnectionNotYetInitializedOrMessageWasEmptyError extends Error {
    constructor(message: string);
}
declare class ConnectionsCannotCreateNewConnectionUserAlreadyExistsError extends Error {
    constructor(message: string);
}
declare class SendFunctionMessageCountExceededError extends Error {
    constructor(message: string);
}
declare class IncompleteEnvironmentVariableError extends Error {
    constructor(message: string);
}
declare class ConnectionCannotCreateNewClientConnectionInvalidIdError extends Error {
    constructor(message: string);
}
declare class GeminiSettingsIdentifierAlreadyHasSessionError extends Error {
    constructor(message: string);
}
declare class SessionCleanupWorkerCannotInitializeInvalidConfig extends Error {
    constructor(message: string);
}
declare class SocketConnectionsReferenceNotYetInitializedError extends Error {
    constructor(message: string);
}
export { GeminiSettingsApiKeyNotSetError, GeminiSettingsInvalidMessageString, GeminiSettingsNoIdWasFoundError, GeminiSettingsNotYetInitializedError, GeminiSettingsSpecifiedMaxSessionsReachedError, GeminiSettingsInvalidBotType, GeminiSettingsInvalidSystemInstruction, GeminiSessionNotAvailableError, GeminiSessionAlreadyInitializedError, GeminiSessionNotYetInitializedError, GeminiSessionNoIdWasFoundError, GeminiSessionCannotAskMessageWasEmptyOrNotInitialized, ConnectionNotYetInitializedOrMessageWasEmptyError, ConnectionsCannotCreateNewConnectionUserAlreadyExistsError, SendFunctionMessageCountExceededError, IncompleteEnvironmentVariableError, ConnectionCannotCreateNewClientConnectionInvalidIdError, GeminiSettingsIdentifierAlreadyHasSessionError, SessionCleanupWorkerCannotInitializeInvalidConfig, SocketConnectionsReferenceNotYetInitializedError };
