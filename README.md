<h1 align=center> Google-Gemini-Messenger-Chatbot </h1>
<p align="center"> A Chatbot for Facebook Messenger using Facebook Graph API and Google Gemini AI API</p>

<div align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <a href="#" src="https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white"></a>
  <a href="#" src="https://img.shields.io/badge/release-v.1.5.5-blue"></a>
  <a href="#" src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FNubScript7%2FGoogle-Gemini-Messenger-Chatbot&countColor=%23f47373"></a>
</div>

## Work in progress 🏗️🚀

> this project is this in progress!

## ⭐ Features

- You can use command by typing an exclamation mark `!` before you message
- You can ask Gemini by just typing your message

> **Attention**
>
> - When you type a command but the command does not exists, it will ask gemini your message
> - So dont mispell command or it will by default ask Gemini

<details open>
<summary>
 <h3> Commands </h3>
</summary>

#### The available command are:

- !help - prints the instruction of how to use the app, also tells the list of commands
- 


</details>

## ✅ Installation

- To install, first download or clone [this](https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot) repository.

```bash
git clone https://github.com/NubScript7/Google-Gemini-Messenger-Chatbot
```

> **Attention!**
>
> - If you have not already, install [nodejs](https://nodejs.com)

- After that, install the required dependencies of this project.

```bash
npm install
```

> Installation of required dependencies might take a while.
> **Recommended** to download required dependencies over a wifi network

> Thats it! you have successfully downloaded the required dependencies 🥳

## Usage

> ⚠️**Attention**⚠️
>
> - You need a messenger page with `graph api` and `webhooks` already setup
> - You also need a google ai api key
> - Put your api key in a `.env` file as the name `GOOGLE_GEMINI_API_KEY`

```text
  GOOGLE_GEMINI_API_KEY=<YOUR_GOOGLE_AI_API_KEY_HERE>
```

- To start the last bundled app, from the CLI run:

```bash
npm run start
```

> You **can** modified the application code to add or remove features for your needs

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