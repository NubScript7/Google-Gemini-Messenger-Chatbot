<h1 align=center> Google-Gemini-Chatbot-API (cloudflare edition)</h1>
<p align="center"> A Chatbot API for your applications. Now in cloudflare workers with minimal cold start times!</p>

<div align="center">
<a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
<a href="#"><img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FNubScript7%2FGoogle-Gemini-Messenger-Chatbot&countColor=%23f47373"></a>
<a href="#"><img src="https://img.shields.io/badge/release-v.2.0.0-blue"></a>
</div>

## Work in progress :construction: :construction_worker:

> this project would always be in progress as long as im alive

## :star: Features

- ~~You can use command by typing an exclamation mark `!` before you message~~ (removed in this version)
- You can ask Gemini by sending a POST request

## :crown: Q & A

> [!NOTE]
>
> When i mention `vendor(s)` i refer to companies, groups, individuals, etc. that offers ai software/service.

#### Why Gemini? Why not ChatGPT or other vendors?

- I use Google Gemini because it is great for small projects, it offers free chat generation as long you are below the free tier barrier
- You can use whatever you preferred

#### Can i use my preferred AI vendor?

- Ofcourse! You can modify and change vendors whenever you like!

#### Can i customize the bot? (e.g: instructions, name, behavior)

- Yes, as i said, you can modify and change whatever you like based on your needs

<details open>
<summary>
 <h3> :computer: Commands </h3>
</summary>

#### The available command are:

> [!WARNING]
> Commands are not supported in this version. You can still implement it but there will be another cloudflare version that will bring back the old features!

- !help - prints the instruction of how to use the app, also tells the list of commands
- !v - get app version
- !help - used to print this help message
- !ch-server - change the server to ask DigyBot (type '!ch-server' to change current server) - disabled
- !server - to get the server you are currently on - unimplemented
- !modes - used to know about the output modes - unimplemented
- !mode - used to get what output mode you are using - unimplemented
- !ch-mode - change the output mode (type '!modes' to know about the modes) - unimplemented
- !clear - used to clear the chat history from the app
- !history - used to print your chat history - disabled

> You can add or remove commands based on what you need!

</details>

## :white_check_mark: Installation

- To get started, first download or clone [this](https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot) repository.

```bash
git clone https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot
```

> **Attention!**
>
> If you have not already, install [nodejs](https://nodejs.com)

- After that, install the required dependencies of this project.

### install required dependencies

```bash
pnpm install
```


> Thats it! you have successfully downloaded the required dependencies :raised_hands: :dancer:

## Usage

> :warning: **Attention** :warning:
>
> You need a google ai api key.
> Put your api key in a `.env` file as the name `GOOGLE_GEMINI_API_KEY`

- your `.env` file should look like this:

```.env
  GOOGLE_GEMINI_API_KEY=<YOUR_GOOGLE_AI_API_KEY_HERE>
```

- To start run this command:

```bash
pnpm run dev
```

> This will start a preview of the cloudflare worker on your local machine

- If you have made changes to the code and you are now satisfied and ready to deploy, run this code:

```bash
pnpm run deploy
```

> [!WARNING]
> You must have a cloudflare account and signed-in with the CLI in order to deploy the cloudflare worker.
