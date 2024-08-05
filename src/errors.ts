class GeminiSettingsApiKeyNotSetError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class GeminiSettingsInvalidMessageString extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class GeminiSettingsNoIdWasFoundError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSettingsNotYetInitializedError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSettingsSpecifiedMaxSessionsReachedError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSettingsInvalidBotType extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSettingsInvalidSystemInstruction extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }

}

class GeminiSessionNotAvailableError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}


class GeminiSessionAlreadyInitializedError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSessionNotYetInitializedError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSessionNoIdWasFoundError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
class GeminiSessionCannotAskMessageWasEmptyOrNotInitialized extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class ConnectionNotYetInitializedOrMessageWasEmptyError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class ConnectionsCannotCreateNewConnectionUserAlreadyExistsError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class SendFunctionMessageCountExceededError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class IncompleteEnvironmentVariableError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class ConnectionCannotCreateNewClientConnectionInvalidIdError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class GeminiSettingsIdentifierAlreadyHasSessionError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class SessionCleanupWorkerCannotInitializeInvalidConfig extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

class SocketConnectionsReferenceNotYetInitializedError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

export {
  GeminiSettingsApiKeyNotSetError,
  GeminiSettingsInvalidMessageString,
  GeminiSettingsNoIdWasFoundError,
  GeminiSettingsNotYetInitializedError,
  GeminiSettingsSpecifiedMaxSessionsReachedError,
  GeminiSettingsInvalidBotType,
  GeminiSettingsInvalidSystemInstruction,
  GeminiSessionNotAvailableError,
  GeminiSessionAlreadyInitializedError,
  GeminiSessionNotYetInitializedError,
  GeminiSessionNoIdWasFoundError,
  GeminiSessionCannotAskMessageWasEmptyOrNotInitialized,
  ConnectionNotYetInitializedOrMessageWasEmptyError,
  ConnectionsCannotCreateNewConnectionUserAlreadyExistsError,
  SendFunctionMessageCountExceededError,
  IncompleteEnvironmentVariableError,
  ConnectionCannotCreateNewClientConnectionInvalidIdError,
  GeminiSettingsIdentifierAlreadyHasSessionError,
  SessionCleanupWorkerCannotInitializeInvalidConfig,
  SocketConnectionsReferenceNotYetInitializedError
};
