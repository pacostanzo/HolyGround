const app = require("./app");
const port = process.env.PORT;

app.listen(port, function() {
  console.log("Suelo Sagrado server has started at PORT = " + port);
});
