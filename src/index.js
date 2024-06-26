const { app, ai, net } = require("./main.js")

if(process.argv.includes("--dotenv")){
  const path = require("path");
  require("dotenv").config({path: path.resolve(__dirname,"../.env")})
  net.set_output("http://localhost:2468")
}

const requiredEnvironmentVariables = [
  "GOOGLE_GEMINI_API_KEY",
  "FB_PAGE_VERIFY_TOKEN",
  "FB_PAGE_ACCESS_TOKEN"
]

if(requiredEnvironmentVariables.some(e => process.env[e] === undefined))
  throw new IncompleteEnvironmentVariableError("One of required environment variable failed to load or not initialized")

ai.init(process.env.GOOGLE_GEMINI_API_KEY); 

console.log(net)
app.listen(process.env.PORT || 3000, () => {
  console.log("app is healty and running!")
})

module.exports = app