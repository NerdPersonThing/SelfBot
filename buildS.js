function everything() {

const trigger = '&';
const version = 'S1.0.8';

const fs = require("fs");
const config = require('../configSelf.json');
let configObj = JSON.parse(fs.readFileSync('../configSelf.json', 'utf8'));
const Discord = require('discord.js');
const bot = new Discord.Client();
var exec = require('child_process').exec;
var alt = config.alt;
var sleep = 0;
var downshut = 0;
var l = 100;
var datime = 'void';
var simptime = 'void';

var path = require('path');
var scriptName = path.basename(__filename); //writes name of JS file as scriptName

if(scriptName === 'buildT.js') {
    test = 1;
}
if(scriptName === 'buildS.js') {
    test = 0;
}

var shortcuts = new Map([
  ["lenny", "( ͡° ͜ʖ ͡°)"],
  ["shrug", "¯\\_(ツ)_/¯"],
  ["tableflip", "(╯°□°）╯︵ ┻━┻"],
  ["raosted", "https://cdn.discordapp.com/attachments/251182658720235521/263044450299674624/raosted.gif"],
  ["exposed", "https://cdn.discordapp.com/attachments/260575179325964300/283804510915395584/exposed2.gif"]
]);



bot.on('message', (message) => {

    if(message.author !== bot.user && message.author.id !== "193587165114925057" && message.author.id !== "225409471306792981") {
        return;
    }
    
    var origmsg = message.content;
    message.content = message.content.toLowerCase();
    

    if(message.content.startsWith(trigger + 'wakeup')) {
           sleep = 0
            setTimeout( () => { message.edit('Ignore all unusual things I may say.') }, 50);
             bot.user.setStatus('online');
            return;
    }  
   
    if(sleep === 1) {
        return;
    }
    
  
    if(!message.content.startsWith(trigger)) {
        return;
    }

    let cmd = message.content.split(' ')[0];
    cmd = cmd.slice(trigger.length);

    let origargs = origmsg.split(' ').slice(1);
    let args = message.content.split(' ').slice(1);

    timestamp();
    if(message.author == bot.user) {
        console.log(`${datime}: Me: "${message.content}"`);
    } else {
        console.log(`${datime}: ${message.author.username}: "${message.content}"`);
    }

    //end formatting
    
    if(cmd === 'setaccount') {
        if(args[0] === 'regular') {
            configObj.alt = 0;
            message.channel.sendMessage(`Done. Use ${trigger}reboot to switch to the main account.`);
        } else {
        if(args[0] === 'alt') {
            configObj.alt = 1;
            message.channel.sendMessage(`Done. Use ${trigger}reboot to switch to the alt-account.`);
        } else {;
        message.channel.sendMessage('Use either "regular" or "alt".');
        } }
        fs.writeFile('../configSelf.json', JSON.stringify(configObj), (err) => {
            if (err) console.error(err)
        });
        return;
    }

    if(cmd === 'reboot') {
        console.log('Rebooting...');
        shutdown();
        return;         
    }

    //end open-user commands 


    if(message.author !== bot.user) {
        return;
    }

    if(cmd === 'selfhelp') {
        setTimeout( () => { message.edit('test, prune, myid, setgame, listservers, nick, sleep, reboot, setaccount, vriskbotreboot, vriskbotshutdown, vriskbotstart, update, [shortcuts]') }, 50);
    }
    
    if(cmd === 'prune') {
        l = 100
        let messagecount = parseInt(args[0]+1);
        message.channel.fetchMessages({limit: l})
        .then(messages => {
            let msg_array = messages.array();
            msg_array = msg_array.filter(m => m.author.id === bot.user.id);
            msg_array.length = messagecount;
            msg_array.map(m => m.delete().catch(console.error));
        }).catch(console.error);
    }  
    
    if(cmd === 'test') {
        message.delete();
        return;
    }

    if(shortcuts.has(cmd)) {
        setTimeout( () => { message.edit(shortcuts.get(cmd)) }, 50);
        return;
    }


    if(cmd === 'myid') {
        setTimeout( () => { message.edit(`${message.author.id}`) }, 50);
        return;
    }
    

    if(cmd === 'listservers') {
        setTimeout( () => { message.edit(`These are all the servers that I'm on: \`\`\`${bot.guilds.map(guild => guild).join(', ')}\`\`\``) }, 50);
        return;
    }

    if(cmd === 'setgame') {
        let game = origargs.join(' ');
        bot.user.setStatus(null, game);
        message.delete().catch(console.error);
        return;
    }

    if(cmd === 'nick') {
        let nickname = origargs.join(' ');
        message.member.setNickname(nickname);
    }

    if(cmd === 'sleep') {
        setTimeout( () => { message.edit('I\'m totally normal.') }, 50);
        sleep = 1
        return;
    }



    if(cmd === 'vriskbotreboot') {
            message.channel.sendMessage(`Just use ${trigger}vriskbotshutdown and then ${trigger}vriskbotstart - less buggy.`);
    }

    if(cmd === 'vriskbotshutdown') {
        child = exec("pm2 stop VriskBot", function (error, stdout, stderr) {
            message.channel.sendMessage('Attempting to shut down VriskBot...');
            console.log(`Attempting to shut down VriskBot...`);
            if(error) return console.log(error);
            return;
            });
        return;
    }

    if(cmd === 'vriskbotstart') {
        child = exec("pm2 start VriskBot --watch", function (error, stdout, stderr) {
            message.channel.sendMessage('Attempting to start VriskBot...');
            console.log(`Attempting to start VriskBot...`);
            if(error) return console.log(error);
            return;
            });
        return;
    }

    if(cmd === 'eval') {
        try {
            var code = origargs.join(' ');
            var evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }

            setTimeout( () => { message.edit(`:arrow_right: CODE: \`\`\`${code}\`\`\` \n:white_check_mark: RESULT: \`\`\`${evaled}\`\`\``) }, 50);
            return;
        } catch(err) {
            setTimeout( () => { message.edit(`:arrow_right: CODE: \`\`\`${code}\`\`\` \n:octagonal_sign: ERROR: \`\`\`${err}\`\`\``) }, 50);
            return;
        }
    }



    if(cmd === 'update') {
        child = exec("git pull", function (error, stdout, stderr) {
        if(error) return console.log(error);
        let response = stdout.split(' ')[0];
        if(response === 'Updating') {
            message.channel.sendMessage('Successfully updated selfbot! Rebooting...');
            console.log(`Successfully updated. Rebooting...`);
            process.exit(1);
        } else {
            message.channel.sendMessage(stdout);
            console.log(`Update failed: ${stdout}`);
            return;
        }
        });
    }
}); //end message event

bot.on('messageDelete', (message) => {
    
    if(message.author === bot.user) {
        return;
    }
    if(message.author.bot) {
        return;
    }
    timestamp();
    let pass = 0;

    if(message.channel.type !== 'dm') {
        let server = message.guild.name;
    } else {
        pass = 1;
        server = "DM's";
    }

    if(message.channel.type === 'text') {
        if(message.guild.id === '251182658720235521') {
            pass = 1;
            server = "KKK3";
        }
        if(message.guild.id === '258760772413292546') {
            pass = 1;
            server = "YCD";
        }
        if(message.guild.id === '260577188322082816') {
            pass = 1;
            server = "Peace";
        }
        if(message.guild.id === '196653602801057793') {
            pass = 1;
            server = "Homestak";
        }
        if(message.guild.id === '260575179325964300') {
            pass = 1;
            server = "Dev";
        }
    }

    if(message.channel.type === 'group') {
        pass = 1;
        server = "Overwatch";
    }

    if(pass === 1) {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message from ${message.author.username} deleted in ${server}: \`\`\`${message}\`\`\``).catch(console.error);
        return;
    }
    if(pass === 0) {
        bot.channels.get('289526101066252299').sendMessage(`${datime}: Message from ${message.author.username} deleted in ${server}: \`\`\`${message}\`\`\``).catch(console.error);
    }
    return;

}); 

bot.on('messageUpdate', (oldMessage, newMessage) => {

    let message = oldMessage
    if(message.author === bot.user) {
        return;
    }
    if(message.author.bot) {
        return;
    }
    timestamp();

    let reg = new RegExp("^(http://|https://|-play)", "i");
    let match = reg.test(message.content);
    let pass = 0;
    if(match == true) {
        return;
    }

    if(message.channel.type !== 'dm') {
        let server = message.guild.name;
    } else {
        pass = 1;
        server = "DM's";
    }

    if(message.channel.type === 'text') {
        if(message.guild.id === '251182658720235521') {
            pass = 1;
            server = "KKK3";
        }
        if(message.guild.id === '258760772413292546') {
            pass = 1;
            server = "YCD";
        }
        if(message.guild.id === '260577188322082816') {
            pass = 1;
            server = "Peace";
        }
        if(message.guild.id === '196653602801057793') {
            pass = 1;
            server = "Homestak";
        }
        if(message.guild.id === '260575179325964300') {
            pass = 1;
            server = "Dev";
        }
    }
    if(message.channel.type === 'dm') {
        pass = 1;
        server = "DM's";
    }
    if(message.channel.type === 'group') {
        pass = 1;
        server = "Overwatch";
    }

    if(pass === 1) {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message edited by ${message.author.username} in ${server}, from \`\`\`${oldMessage}\`\`\` to \`\`\`${newMessage}\`\`\``).catch(console.error);
        return;
    }
    if(pass === 0) {
        bot.channels.get('289526101066252299').sendMessage(`${datime}: Message edited by ${message.author.username} in ${server}, from \`\`\`${oldMessage}\`\`\` to \`\`\`${newMessage}\`\`\``).catch(console.error);
    }
    return;

}); 
//end message-delete and -edit events 

setInterval(function(){
    timestamp();
    bot.channels.get('321402536709849101').sendMessage(`${datime} | | | | | | | | | | | | | | | | | | |`);
}, 60000);





if(alt === 0) {
    bot.login(config.tokenSelf);
    console.log('Ready to initiate on default account.');
}
if(alt === 1) {
    bot.login(config.tokenAlt);
    console.log('Ready to initiate on alt-account.');
}





bot.on('ready', () => {
    timestamp();
    console.log(`ALERT: ${datime}: Selfbot is up and running. Press CTRL+C to stop...`);
    bot.channels.get('262249669692882946').sendMessage(`${datime}: Selfbot online, version ${version}.`);
    bot.user.setStatus('invisible');

}); //end readylog



function shutdown() {
    console.log('Shutdown commencing...');
    process.exit(1);
    }

function timestamp() {
    let date = new Date();
    
    let yy = date.getFullYear();
    let mm = date.getMonth()+1;
    let dd = date.getDate();
    let h = date.getHours(); h = (h < 10 ? "0" : "") + h;
    let m = date.getMinutes(); m = (m < 10 ? "0" : "") + m;
    let s = date.getSeconds(); s = (s < 10 ? "0" : "") + s;
    
    datime = `${yy}/${mm}/${dd}, ${h}:${m}:${s}`;
    simptime = `${h}:${m}:${s}`;

}




} //end everything();
everything();
