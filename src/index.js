const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Suelo Sagrado server has started at PORT = ' + port);
});
