const $ = require("axios");
const prompt = require("prompt-sync")();

let res = "";
let msgHistory = [];
let msgIndex = -1;
console.log("type !q to quit.\ntype !. to resend last message");

function ask(msg, async=false) {
	msgHistory.push(msg);
	msgIndex = -1;
	const post = $.post("http://localhost:3000/generative-ai/api/v1/webhook", {
		object: "page",
		entry: [
			{
				messaging: [
					{
						sender: {
							id: 8297504716950349
						},
						message: {
							text: msg || "!id"
						}
					}
				]
			}
		]
	});
	post.then(e => {
		console.log("message sent");
		getUserMsg();
	})
	.catch(e => {
		console.log("message was not sent", e?.response?.data);
		getUserMsg();
	});
	
	return post;
}

async function getUserMsg() {
	const message = prompt("message you want to ask: ");
	switch(message) {
		case "!q":
			console.log("quiting...");
			return;
		break;
		case "!.": {
			msgIndex++;
			//console.log(JSON.stringify({msg:msgHistory[msgIndex]}))
			getUserMsg();
			process.stdin.write(msgHistory[msgIndex]?.trim() || "");
			return;
		} break;
		case "!,": {
			msgIndex--;
			//console.log(JSON.stringify({msg: msgHistory[msgIndex]}))
			getUserMsg();
			process.stdin.write(msgHistory[msgIndex]?.trim() || "");
			return;
		} break;	
		
	}
	ask(message);
}

getUserMsg();