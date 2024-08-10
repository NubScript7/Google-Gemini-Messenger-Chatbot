9<h1 align=center> Google-Gemini-Messenger-Chatbot </h1>
<p align="center"> A Chatbot for Facebook Messenger using Facebook Graph API and Google Gemini AI API</p>

<div align="center">
<a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
<a href="#"><img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FNubScript7%2FGoogle-Gemini-Messenger-Chatbot&countColor=%23f47373"></a>
<a href="#"><img src="https://img.shields.io/badge/release-v.1.5.5-blue"></a>
</div>

## Work in progress :construction: :construction_worker:

> this project is still in progress!

## :star: Features

- You can use command by typing an exclamation mark `!` before you message
- You can ask Gemini by just typing your message

> **Attention**
> if you have typed a command but the command does not exists, it will by default ask Gemini

## :crown: Q & A

> :warning: **Attention** :warning:
>
> - When i mention `vendor(s)` i refer to companies, groups, individuals, etc. that offers ai software.

#### Why Gemini? Why not ChatGPT or other vendors?

- I use Google Gemini because it is great for small projects, it offers free chat generation as long you are below the free tier barrier
- You can use your preferred

#### Can i use my preferred AI vendor?

- Ofcourse! You can modify and change vendors whenever you like!

#### Can i customize the bot? (e.g: instructions, name, behavior)

- Yes, as i said, you can modify and change whatever you like based on your needs

<details open>
<summary>
 <h3> :computer: Commands </h3>
</summary>

#### The available command are:

- !help - prints the instruction of how to use the app, also tells the list of commands
- !v - get app version\n
- !help - used to print this help message
- !ch-server - change the server to ask DigyBot (type '!ch-server' to change current server)
- !server - to get the server you are currently on
- !modes - used to know about the output modes
- !mode - used to get what output mode you are using
- !ch-mode - change the output mode (type '!modes' to know about the modes)
- !clear - used to clear the chat history from the app
- !history - used to print your chat history

> You can add or remove commands based on what you need!

</details>

## :white_check_mark: Installation

- To get started, first download or clone [this](https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot) repository.

```bash
git clone https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot
```

> **Attention!**
>
> - If you have not already, install [nodejs](https://nodejs.com)
> - you can also use [deno](https://deno.com) or [bun](https://oven.sh)

- After that, install the required dependencies of this project.

### npm

```bash
npm install
```

### yarn

```bash
yarn install
```

### pnpm

```bash
pnpm install
```

> Installation of required dependencies might take a while.
> **Recommended** to download required dependencies over a wifi network

> Thats it! you have successfully downloaded the required dependencies :raised_hands: :dancer:

## Usage

> :warning: **Attention** :warning:
>
> - You need a messenger page with `graph api` and `webhooks` already setup
> - You also need a google ai api key
> - Put your api key in a `.env` file as the name `GOOGLE_GEMINI_API_KEY`

- your `.env` file should look like this:

```.env
  GOOGLE_GEMINI_API_KEY=<YOUR_GOOGLE_AI_API_KEY_HERE>
```

> - I will make a step-by-step tutorial on how to do this when i have free time

- To start the last bundled app, from the CLI run:

```bash
npm run start
```

> You **can** modify the application code to add or remove features for your needs

- If you have modified the typescript file(s), run:

```bash
  npm run compile
```

- Then

```bash
npm run start:preview
```

> _You can also bundle the files you have generated after running `npm run compile`_

```bash
npm run build
```

- If you want a one liner version

```bash
npm run production
```

- or if you use `bun` you can run:

```bash
bun bunBundler.js
```
