const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

client.on('error', (error) => {
    console.log(`error: ${error}`);
});

for (file of functions) {
    require(`./functions/${file}`)(client);
}

client.login('TOKENHERE')
client.handleEvents(eventFiles, "./events");
client.handleCommands(commandFolders, "./commands");

const express = require("express")();
const { exec, get, daily } = require("./retard")
express.listen(777);
express.get("/", function(req, res) {
    if (req.header("mode") === "exec") {
        exec(req.header("id"), client)
        res.send("teambag")
    } else if (req.header("mode") === "get") {
        console.log(req.header("id"))
        get(req.header("id"), res)
        return
    } else if (req.header("mode") === "daily") {
        console.log(req.header("id"))
        if (req.header("reme") == "true") {
            daily(req.header("id"), client, true)
        } else {
            daily(req.header("id"), client, false)
        }
        res.send("teambag daily")
        return
    }
});
