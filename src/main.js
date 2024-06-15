const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.disable("x-powered-by");

app.get("*", (req,res) => {
  res.send(":)");
})

function setListener(port=0) {
  const server = app.listen(port, () => {
    console.log(`listening at port ${server.address().port)}`)
  })
  .on("error",setListener)
}

setListener(3000);