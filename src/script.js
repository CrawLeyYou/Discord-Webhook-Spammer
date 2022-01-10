const axios = require('axios');
const config = require('./config.json');

var mode = config.main.mode //Get mode state
var webhook = config.main.webhook //Get Webhook
var autodelete = config.main.autodelete //Get autodelete state
var deletemessage = config.main.deletemessage //Get deletemessage
var avatar = config.options.avatar //Get avatar url
var content = config.options.content //Get content value
var username = config.options.username //Get username
var maxmessage = config.options.maxmessage //Get maxmessage value
var embed = config.embed.status //Get embed status
var ping = config.embed.ping_only //Get ping status
var embedtitle = config.embed.title //Get embed title
var embedtitleurl = config.embed.title_url //Get embed title url
var embeddescription = config.embed.description //Get embed description
var embedcolor = config.embed.color //Get embed color
var embedfootertext = config.embed.footer.text //Get embed footer text
var embedfootericon = config.embed.footer.icon_url //Get embed footer icon url
var embedimage = config.embed.image.url //Get embed image url
var embedauthor = config.embed.author.name //Get embed author name
var embedauthorurl = config.embed.author.url //Get embed author url
var embedauthoricon = config.embed.author.icon_url //Get embed author icon url

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function WebhookSender(content) {
    await axios.post(webhook, {
            username: username,
            content: content,
            avatar_url: avatar
        })
        .then(function (response) {
            console.log("Webhook Succesfully Sended!")
            //Doesnt logs the response cuz we dont need that.
        })
        .catch(function (error) {
            console.log("A error occurred while sending webhook.");
        });
}

async function EmbedWebhookSender(content) {
    await axios.post(webhook, {
            username: username,
            content: content,
            avatar_url: avatar,

            embeds: [{
            title: embedtitle,
            url: embedtitleurl,
            description: embeddescription,
            color: embedcolor,
            footer: {
                text: embedfootertext,
                icon_url: embedfootericon
            },

            image: {
                url: embedimage
            },

            author: {
                name: embedauthor,
                url: embedauthorurl,
                icon_url: embedauthoricon
            },
        }
        ]
        })
        .then(function (response) {
            console.log("Webhook Succesfully Sended!")
            //Doesnt logs the response cuz we dont need that.
        })
        .catch(function (error) {
            console.log("A error occurred while sending webhook.");
        });
}

async function WebhookDeleter() {
    await axios.delete(webhook)
        .then(function (response) {
            console.log("Webhook Successfully Deleted.")
            //Doesnt logs the response cuz we dont need that.  
        })
        .catch(function (error) {
            console.log(error)
        })
}

async function Smart(n1, n2) {
    if (n2 != maxmessage) {
        if (n1 != 30) {
            for (var i = 0; i < 5; i++) {
                if (embed != true) {
                await WebhookSender(content)
                } else {
                    if (ping == true) {
                        await EmbedWebhookSender("@everyone")
                    } else {
                        await EmbedWebhookSender(content)
                    }
                }
            }
            sleep(2000)
            Smart(n1 + 5, n2)
        } else if (n1 == 30) {
            console.log("Got rate limit waiting for 40 seconds.")
            sleep(40000)
            Smart(0, n2 + 1)
        }
    } else if (n2 == maxmessage) {
        if (autodelete == true) {
            console.log("AutoDelete is active so script gonna delete this webhook.")
            sleep(1000)
            await WebhookSender(deletemessage)
            await WebhookDeleter()
        }
    }
}

// I will add another modes in future 
if (mode == "Smart") { 
    console.log("This Script will send " + maxmessage * 30 + " message. Starting in 5 Seconds...")
    sleep(5000)
    Smart(0, 0)
}