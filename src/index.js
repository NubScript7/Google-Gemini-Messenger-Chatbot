const { app } = require("./main.js")

app.listen(process.env.PORT || 3000, () => {
  console.log("app is healty and running!")
})
