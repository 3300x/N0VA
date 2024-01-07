/*
MIT license: https://opensource.org/licenses/MIT
made by nebelung and lyn
*/

const express = require("express")
const app = express()
const fetch = require("node-fetch")
const config = require("./config.json")
const port = process.env.PORT || config.port
const Corrosion = require("./lib/server")

const proxy = new Corrosion({
    prefix: config.prefix,
    codec: config.codec,
    title: "N0VA",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([
            "discord.com",
        ], "Using proxies can get you banned off discord because your ip changes."),
    ]
});

proxy.bundleScripts();

app.use(express.static("./public", {
    extensions: ["html"]
}));

app.get("/", function(req, res){
    res.sendFile("index.html", {root: "./public"});
});

app.get("/suggestions", function(req, res){
async function getsuggestions() {
var term = req.query.q || "";
var response = await fetch("https://duckduckgo.com/ac/?q=" + term + "&type=list");
var result = await response.json();
var suggestions = result[1]
res.send(suggestions)
}
getsuggestions()
});

app.use(function (req, res) {
    if (req.url.startsWith(proxy.prefix)) {
      proxy.request(req,res);
    } else {
      res.status(404).sendFile("404.html", {root: "./public"});
    }
})

app.listen(port, () => {
    console.log(`N0VA is running at localhost:${port}`)
})
