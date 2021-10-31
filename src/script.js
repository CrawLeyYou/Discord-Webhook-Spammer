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
                await WebhookSender(content)
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