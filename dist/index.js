// src/index.ts
import { Hono as Hono8 } from "hono";
import { serve } from "@hono/node-server";

// src/routes/index.ts
import { Hono as Hono7 } from "hono";

// src/routes/api/index.ts
import { Hono as Hono2 } from "hono";

// src/routes/api/facebook.ts
import { Hono } from "hono";

// node_modules/@hono/zod-validator/dist/index.js
import { validator } from "hono/validator";
function zValidatorFunction(target, schema, hook, options) {
  return validator(target, async (value, c) => {
    let validatorValue = value;
    if (target === "header" && "_def" in schema || target === "header" && "_zod" in schema) {
      const schemaKeys = Object.keys("in" in schema ? schema.in.shape : schema.shape);
      const caseInsensitiveKeymap = Object.fromEntries(schemaKeys.map((key) => [key.toLowerCase(), key]));
      validatorValue = Object.fromEntries(Object.entries(value).map(([key, value$1]) => [caseInsensitiveKeymap[key] || key, value$1]));
    }
    const result = options && options.validationFunction ? await options.validationFunction(schema, validatorValue) : await schema.safeParseAsync(validatorValue);
    if (hook) {
      const hookResult = await hook({
        data: validatorValue,
        ...result,
        target
      }, c);
      if (hookResult) {
        if (hookResult instanceof Response) return hookResult;
        if ("response" in hookResult) return hookResult.response;
      }
    }
    if (!result.success) return c.json(result, 400);
    return result.data;
  });
}
var zValidator = zValidatorFunction;

// src/schema/validator/facebook.ts
import z from "zod";
var senderSchema = z.object({
  id: z.string().min(1)
});
var messageSchema = z.object({
  text: z.string().min(1)
});
var userMessageEntrySchema = z.object({
  sender: senderSchema,
  message: messageSchema
});
var userMessageMessagingBodySchema = z.object({
  messaging: z.array(userMessageEntrySchema).min(1)
});
var userRequestBodySchema = z.object({
  object: z.string(),
  entry: z.array(userMessageMessagingBodySchema).min(1)
});

// src/core/chatbot/client.ts
var BLANK_PSID = "-1";
var Connection = class {
  psid;
  active = true;
  linkedGeneration;
  constructor(id, generation) {
    this.psid = id;
    this.linkedGeneration = generation;
  }
  deactivate() {
    this.active = false;
    this.psid = BLANK_PSID;
  }
  reactivate(id) {
    if (this.active) return;
    this.active = true;
    this.psid = id;
  }
};

// src/core/chatbot/generation.ts
import { GoogleGenAI } from "@google/genai";

// src/core/environment.ts
import { config } from "dotenv";
import dotenvParser from "dotenv-parse-variables";
var loaded = config();
var env = dotenvParser(loaded.parsed);

// src/error.ts
var GenerationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
var EnvironmentVariableError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};

// src/core/chatbot/generation.ts
var AI_MODEL = env.OVERRIDE_MODEL || "gemini-2.5-flash-lite";
var { GOOGLE_GEMINI_API_KEY } = env;
if (!GOOGLE_GEMINI_API_KEY) {
  throw new GenerationError("The API key must be defined in the environment variable.");
}
var GenerationManager = class {
  genAI;
  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY });
  }
  createChat(history = []) {
    return this.genAI.chats.create({
      model: AI_MODEL,
      history
    });
  }
  async generateContent(message) {
    const response = await this.genAI.models.generateContent({
      model: AI_MODEL,
      contents: message
    });
    return response.text;
  }
};
var generationManager = new GenerationManager();
var Generation = class {
  active = true;
  timeCreated;
  lastActive;
  chat;
  constructor(history) {
    const time = Date.now();
    this.timeCreated = time;
    this.lastActive = time;
    this.chat = generationManager.createChat(history);
  }
  reset(history) {
    this.active = true;
    const time = Date.now();
    this.timeCreated = time;
    this.lastActive = time;
    this.chat = generationManager.createChat(history);
  }
  updateTime() {
    this.lastActive = Date.now();
  }
  async generateContent(message) {
    this.updateTime();
    const response = await this.chat.sendMessage({ message });
    return response.text;
  }
  deactivate() {
    this.active = false;
    const time = Date.now();
    this.timeCreated = time;
    this.lastActive = time;
  }
};

// src/core/chatbot/history.ts
var HistoryManager = class _HistoryManager {
  static instance;
  history = /* @__PURE__ */ new Map();
  static EMPTY = [];
  static getInstance() {
    if (!_HistoryManager.instance) {
      _HistoryManager.instance = new _HistoryManager();
    }
    return _HistoryManager.instance;
  }
  getHistory(_id) {
    return [];
  }
};

// src/core/chatbot/connectionManager.ts
var ConnectionManager = class _ConnectionManager {
  static instance;
  clientManager = ClientManager.getInstance();
  static getInstance() {
    if (!_ConnectionManager.instance) {
      _ConnectionManager.instance = new _ConnectionManager();
    }
    return _ConnectionManager.instance;
  }
  getConnection(id) {
    return this.clientManager.getClient(id);
  }
  deactivate(id) {
    return this.clientManager.deactivate(id);
  }
};
var GenerationManager2 = class _GenerationManager {
  static instance;
  generations = /* @__PURE__ */ new Map();
  free = [];
  static getInstance() {
    if (!_GenerationManager.instance) {
      _GenerationManager.instance = new _GenerationManager();
    }
    return _GenerationManager.instance;
  }
  getGeneration(id) {
    let generation;
    if (this.generations.has(id)) {
      generation = this.generations.get(id);
    } else {
      generation = this.request(id);
    }
    return generation;
  }
  request(id) {
    let free;
    if (this.free.length >= 1) {
      free = this.free.pop();
    } else {
      const history = HistoryManager.getInstance().getHistory(id);
      free = new Generation(history);
    }
    return free;
  }
};
var ClientManager = class _ClientManager {
  static instance;
  clients = /* @__PURE__ */ new Map();
  free = [];
  static getInstance() {
    if (!_ClientManager.instance) {
      _ClientManager.instance = new _ClientManager();
    }
    return _ClientManager.instance;
  }
  getClient(id) {
    let client;
    if (this.clients.has(id)) {
      client = this.clients.get(id);
    } else {
      const generation = GenerationManager2.getInstance().getGeneration(id);
      client = new Connection(id, generation);
    }
    return client;
  }
  request(id) {
    let free;
    if (this.free.length >= 1) {
      free = this.free.pop();
    } else {
      const generation = GenerationManager2.getInstance().request(id);
      free = new Connection(id, generation);
    }
    return free;
  }
  deactivate(id) {
    if (this.clients.has(id)) {
      const connection = this.clients.get(id);
      connection.deactivate();
      connection.linkedGeneration.deactivate();
      this.clients.delete(id);
      this.free.push(connection);
      return true;
    }
    return false;
  }
};

// src/core/stateManager.ts
var StateManager = {
  ACCCEPT_FB_MESSAGES: true,
  VERSION: env.VERSION || "2.0.0",
  BOT_NAME: "GGMC BOT",
  FB_GRAPH_API_URL: env.FB_GRAPH_API_URL || `https://graph.facebook.com/v23.0/me/messages`,
  SEND_TIMEOUT: 25e3
};

// src/core/sender.ts
import axios from "axios";
var Sender = class _Sender {
  static instance;
  static getInstance() {
    if (!_Sender.instance) {
      _Sender.instance = new _Sender();
    }
    return _Sender.instance;
  }
  async postMessage(payload) {
    return axios.post(
      StateManager.FB_GRAPH_API_URL,
      {
        recipient: {
          id: payload.id
        },
        message: {
          text: payload.message || "INTERNAL: response was empty."
        }
      },
      {
        timeout: StateManager.SEND_TIMEOUT,
        params: {
          access_token: env.FB_PAGE_ACCESS_TOKEN
        }
      }
    );
  }
  async send(payload) {
    const queue = [];
    if (typeof payload == "object" && Array.isArray(payload)) {
      queue.push(...payload);
    } else {
      queue.push(payload);
    }
    for (const item of queue) {
      this.postMessage(item);
    }
  }
};
var SendableMessage = class {
  id;
  message;
  timestamp;
  constructor(id, message) {
    this.id = id;
    this.message = message;
    this.timestamp = Date.now();
  }
};

// src/core/command.ts
var PREFIX = "!";
var COMMANDS = {
  v: {
    default: [`app version: ${StateManager.VERSION}`]
  },
  logs: {
    default: ["Currently Disabled."]
    // default: ["Password required."],
    // run: (output: string[], id: number | string, password: string, logIndex: string) => {
    //     if(process.env.LOGS_PASSWORD !== password) {
    //         const connection = connections.getUser(id);
    //         if (connection === undefined) return;
    //         connection.block(Runtime.blockedTimeSeconds)
    //     }
    //     if (process.env.LOGS_PASSWORD === password && !logIndex) {
    //         for (const LOG of LOGS) {
    //             output.push(...chunkify(LOG));
    //         }
    //     }
    //     const LOG_INDEX = parseInt(logIndex);
    //     if (process.env.LOGS_PASSWORD === password && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length)) {
    //         output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
    //     }
    // },
  },
  on: {
    default: () => {
      StateManager.ACCCEPT_FB_MESSAGES = true;
      return ["bot online."];
    }
  },
  off: {
    default: () => {
      StateManager.ACCCEPT_FB_MESSAGES = false;
      return ["bot offline."];
    }
  },
  "ch-server": {
    default: ["Currently Disabled."]
    /* default: [servers?.strCache, "Type '!ch-server' then name of the server you want to change to:"],
    run: (output: string[], id: string | number, server: string) => {
        if (!servers.names.includes(server)) return output.push("Server does not exists in selectable servers.");
        
        const serverUrl = servers.servers[server];
        const connection = connections.getUser(id);
        
        if(connection === undefined)
          return;
        
        connection.serverName = server;
        connection.serverUrl = serverUrl;
        output.push("Successfully set selected server.");
    }, */
  },
  help: {
    default: [
      `To use, type the message you want to ask ${StateManager.BOT_NAME} or you could use these commands:

!v - get app version
!help - used to print this help message
!ch-server - change the server to ask DigyBot (type '!ch-server' to change current server)
!server - to get the server you are currently on
!modes - used to know about the output modes
!mode - used to get what output mode you are using
!ch-mode - change the output mode (type '!modes' to know about the modes)
!clear - used to clear the chat history from the app
!history - used to print your chat history
`
    ]
  },
  clear: {
    default(id) {
      const client = ConnectionManager.getInstance().getConnection(id);
      client.linkedGeneration.reset(HistoryManager.EMPTY);
      return ["Chat history cleared."];
    }
  },
  history: {
    default: ["Currently disabled."]
    // default(id: PSID) {
    //     const client = ConnectionManager.getInstance().getConnection(id)
    //     const history = client.linkedGeneration.chat.getHistory()
    //     return []
    // }
  },
  abort: {
    default: ["Connection termination aborted."]
  },
  _default: {
    default: ["That is an invalid command."]
  }
};
function handleCommand(message, id) {
  const output = [];
  const isCommand = message.startsWith(PREFIX);
  const messageArgs = isCommand ? message.slice(PREFIX.length).split(" ") : [message];
  if (typeof messageArgs !== "object" && !Array.isArray(messageArgs)) return [output, isCommand];
  const [commandName, ...args] = messageArgs;
  const command = COMMANDS[commandName] ?? COMMANDS._default;
  if (!isCommand || command === void 0) {
    return [output, isCommand];
  }
  if (messageArgs.length === 1) {
    if (typeof command.default === "function") {
      output.push(...command.default(id, ...args));
    } else {
      output.push(...command.default);
    }
  } else if (typeof command?.run === "function") {
    command.run(output, id, ...args);
  }
  return [output, isCommand];
}

// src/routes/api/facebook.ts
var fb = new Hono();
var ConManager = ConnectionManager.getInstance();
var sender = Sender.getInstance();
var GEMINI_THINKING_MESSAGE = `${StateManager.BOT_NAME} is thinking...`;
fb.post("/post_message", zValidator("json", userRequestBodySchema), async (c) => {
  const body = await c.req.json();
  if (body.object !== "page") return c.text("Not Found", 404);
  for (const entry of body.entry) {
    for (const messageEvent of entry.messaging) {
      const message = messageEvent.message.text;
      const psid = messageEvent.sender.id;
      const [output, isCommand] = await handleCommand(message, psid);
      if (isCommand) {
        for (const msg of output) {
          await sender.send(new SendableMessage(psid, msg));
        }
      } else {
        const connection = ConManager.getConnection(psid);
        const response = await connection.linkedGeneration.generateContent(message);
        await sender.send(new SendableMessage(psid, GEMINI_THINKING_MESSAGE));
        sender.send(new SendableMessage(psid, response));
      }
    }
  }
  return c.text("EVENT_RECEIVED", 200);
});
fb.get("/webhook", (c) => {
  const { req } = c;
  const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN;
  const mode = req.query("hub.mode");
  const token = req.query("hub.verify_token");
  const challenge = req.query("hub.challenge");
  if (!mode || !token || mode != "subscribe" || token != verifyToken || !challenge) return c.text("Forbidden", 403);
  console.log("WEBHOOK_VERIFIED");
  return c.text(challenge, 200);
});

// src/routes/api/index.ts
var api = new Hono2();
api.route("/facebook", fb);

// src/routes/status.ts
import { Hono as Hono3 } from "hono";
var status = new Hono3();
status.get("/health", (c) => c.text("app is healthy!"));

// src/routes/debug/index.ts
import { Hono as Hono5 } from "hono";

// src/routes/debug/mockFbserver.ts
import { Hono as Hono4 } from "hono";

// src/schema/validator/mockFbServer.ts
import z2, { string } from "zod";
var recipientSchema = z2.object({
  id: string().min(1)
});
var messageSchema2 = z2.object({
  text: string().min(1)
});
var userPostMessageBodySchema = z2.object({
  recipient: recipientSchema,
  message: messageSchema2
});

// src/routes/debug/mockFbserver.ts
var mockFb = new Hono4();
mockFb.post("/messages", zValidator("json", userPostMessageBodySchema), async (c) => {
  const body = await c.req.json();
  console.log("Mock FB Server received message:", body);
  return c.text("EVENT_RECEIVED");
});
mockFb.get("/messages", (c) => c.text("Switch to POST request dumbass"));

// src/routes/debug/index.ts
var debug = new Hono5();
var ENABLE_DEBUG_API = env.ENABLE_DEBUG_API;
debug.get("/enabled", (c) => c.text(ENABLE_DEBUG_API.toString()));
if (ENABLE_DEBUG_API) {
  debug.route("/mock", mockFb);
}

// src/routes/static.ts
import { Hono as Hono6 } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
var publicServe = new Hono6();
publicServe.use("/*", serveStatic({ root: "./" }));

// src/routes/index.ts
var routes = new Hono7();
routes.route("/api", api);
routes.route("/status", status);
routes.route("/debug", debug);
routes.route("/public", publicServe);
routes.get("/", (c) => c.text("Hello! this is not a place to be :)"));

// src/core/envChecker.ts
var requiredEnvironmentVariables = [
  /* YOUR GOOGLE AI API KEY */
  "GOOGLE_GEMINI_API_KEY",
  /* YOUR FB PAGE ACCESS TOKEN */
  "FB_PAGE_ACCESS_TOKEN",
  /* YOUR FB PAGE ID */
  "FB_PAGE_ID",
  /* your fb page verify token */
  "FB_PAGE_VERIFY_TOKEN"
];
requiredEnvironmentVariables.forEach((e) => {
  if (process.env[e] === void 0)
    throw new EnvironmentVariableError(
      `The environment variable "${e}" was not found which is required.`
    );
});

// src/core/chatbot/sessionCollector.ts
import cron from "node-cron";
var ConManager2 = ClientManager.getInstance();
function identifyState(date) {
  const now = Math.floor(Date.now() / 1e3);
  const diff = now - date;
  if (diff < 1 * 30) return 2 /* WARNING */;
  return 3 /* DEACTIVATE */;
}
var sender2 = Sender.getInstance();
var WARNING_INACTIVE_MESSAGE = "Your session has been inactive for a while. Longer inactivity will result in deactivation.";
var DEACTIVATE_INACTIVE_MESSAGE = "Your session has been deactivated due to prolonged inactivity.";
cron.schedule("*/2 * * * *", () => {
  for (const client of ConManager2.clients.values()) {
    const generation = client.linkedGeneration;
    if (!client.active) continue;
    switch (identifyState(generation.lastActive)) {
      // case InactivityState.FINE:
      //     console.log(`Client ${client.psid} is active.`)
      //     break;
      // case InactivityState.MONITOR:
      //     console.log(`Client ${client.psid} is inactive, monitoring...`)
      //     break;
      case 2 /* WARNING */:
        sender2.send(new SendableMessage(client.psid, WARNING_INACTIVE_MESSAGE));
        break;
      case 3 /* DEACTIVATE */:
        sender2.send(new SendableMessage(client.psid, DEACTIVATE_INACTIVE_MESSAGE));
        ConManager2.deactivate(client.psid);
        break;
    }
  }
});

// src/index.ts
var app = new Hono8();
var PORT = 3e3;
app.route("/", routes);
serve({
  fetch: app.fetch,
  port: PORT
});
console.log(`Server is running on http://localhost:${PORT}`);
//# sourceMappingURL=index.js.map