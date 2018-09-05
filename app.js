var express = require("express");
var bodyParser = require("body-parser");

var app =  express();
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");


var holygrounds = [
    {name: "Futbol Infantil Los Amigos", image: "https://bn1305files.storage.live.com/y4mr98xsX1bp-DiY910yssa6ZntHObQ_0jFGHESiG1lPn-mvyHnRuNRztFJg0fDY6zYMbJP4VNTqjNWjeLbm-K5hTaut0YpNDKTYu94rkGQGHnkCmf8MHUuWdDn38pKjufgRNOpeeXlc6ntDnUxAIbH62jusUBT8D5enTsZ69kc_urwTrGnF9WEsPXmvo1qOG_4VCHgn2pnVeSVBpuThHzcaQ/Fila.png?psid=1&width=1325&height=466"},
    {name: "Futbol Infantil Villa Augusta", image: "https://bn1305files.storage.live.com/y4mOwYxX-cBY8kQhaIXq2SQgIiLoYqrKUygPRHYBUkWbY2DNfH-JM2e0pMI8Mzwv3n9CISjnuOYqidAiGapQFmIGNIikGim2eN0aDsniGgcxz1VXqEc0vPv9touee9LXlnj8pkDuFr2jIk2YFEZxo20Nui31dav9fSE9wJ3ElkBuXbgc2yOdntmCRjdBs7R-ErYnHo5S0U12dgeqhy41t4qIQ/VillaAugusta.png?psid=1&width=1327&height=469"},
    {name: "Club Infantil Quilmes Juniors", image: "https://bn1305files.storage.live.com/y4m0ofU_Lnbe82-E3U2kpIVXPnXyMvPUCEi6WUCbl7JUNGN_Ih5li4-OkRThhItsVLy7sMSRL1Al9Uyh9_QfmgBlTu94oD7ib03kv4kcaNx6_WDXmim3nJDkKxw6Lkg-cTlGHmRC98UKkganPQUOEpZlamRw39gqAjAOGLNnlhLm4CtoK4LoInlwLHMqngRwNgiCwmQhZe9R3qCDhPNMB0-Wg/QuilmesJuniors.png?psid=1&width=295&height=136"}
];


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/holygrounds", function (req, res) {
    res.render("holygrounds", {holygrounds: holygrounds});
});


app.post("/holygrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;

    var newHolyGround = {name: name, image: image};
    holygrounds.push(newHolyGround);
    res.redirect("/holygrounds");
});

app.get("/holygrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.listen(3001, 'localhost', function() {
    console.log("Suelo Sagrado server has started...");
});