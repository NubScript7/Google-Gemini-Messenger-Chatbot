export class GenerationError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}

export class EnvironmentVariableError extends Error {
  constructor(message: string)
  {
      super(message);
      this.name = this.constructor.name;
  }
}
