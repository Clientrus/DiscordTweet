var Twit = require('twit')
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();


//Twitter
var T = new Twit({
    consumer_key: 'xxxxxx',
    consumer_secret: 'xxxxxx',
    access_token: 'xxxxxx',
    access_token_secret: 'xxxxxx',
    strictSSL: true,
})

const express = require('express');
const keepalive = require('express-glitch-keepalive');
 
const app = express();
 
app.use(keepalive);
 
app.get('/', (req, res) => {
  res.json('Ok');
});


// Config (Token, prefix)
const config = require("./config.json");

// Bot ready
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

// Check for messages
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();



    // General Commands:


    /* Restart Command */
    if (command === "restart") {
        if (!message.member.roles.cache.some(r => ["Administrator", "Owner"].includes(r.name)))
            return message.reply("You don't have permissions to use this!");

        const restartingEmbed = new Discord.MessageEmbed()
            .setColor('#eb4034')
            .setTitle('Restarting...')
            .setDescription(`Logged out (${client.user.tag})`)
            .setFooter('⚪')

        const restartedEmbed = new Discord.MessageEmbed()
            .setColor('#345ceb')
            .setTitle('Restarted')
            .setDescription(`Logged in (${client.user.tag})`)
            .setFooter('✅')

        const restartMsg = await message.channel.send(restartingEmbed);
        try {
            setTimeout(async () => {
                await client.destroy();
                await client.login(config.token);
                await restartMsg.edit(restartedEmbed);
            }, 5000);
        } catch (err) {
            console.error(err);
        }
    }

    /* Status/Ping Command */
    if (command === "status" || command === "stat" || command === "ping" || command === "prefix") {
        var ping = Date.now() - message.createdTimestamp + " ms";
        const m = message.channel.send("```✅👌 Online | " + `Ping: ${Date.now() - message.createdTimestamp} ms | ` + `Prefix: '${config.prefix}'` + "```");
    }


    function tweet(tweetBody) {
        T.post('statuses/update', { status: `${tweetBody}` }, function (err, data, response) {
            console.log(data)
        })
    }

    if (command === "tweet") {
        // Check for role
        if (!message.member.roles.cache.some(r => ["Tweet"].includes(r.name)))
            return message.reply("You don't have permissions to use this!");

        const text = args.join(" ");
        if (!text) return message.reply("Cannot send empty tweet");

        tweet(text)
    }
})


client.login(config.token);
