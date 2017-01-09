function everything() {

const trigger = '&';
const version = 'S1.0.8';

const config = require('../configSelf.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
var exec = require('child_process').exec;
var sleep = 0;
var downshut = 0;
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
  ["exposed", "https://cdn.discordapp.com/attachments/251182759589052418/267815685193728000/exposed.gif"]
]);



bot.on('message', (message) => {

    if(message.author !== bot.user) {
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
    console.log(`${datime}: Me: "${message.content}"`);

    
    
    if(cmd === 'selfhelp') {
        setTimeout( () => { message.edit('test, prune, myid, setgame, listservers, nick, sleep, reboot, vriskbotreboot, vriskbotshutdown, vriskbotstart, update, [shortcuts]') }, 50);
    }
    
    if(cmd === 'prune') {
        let messagecount = parseInt(args[0]);
        message.channel.fetchMessages({limit: 100})
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

    if(cmd === 'reboot') {
        console.log('Rebooting...');
        shutdown();
        return;         
    }
    

    if(cmd === 'vriskbotreboot') {
        child = exec("pm2 restart VriskBot", function (error, stdout, stderr) {
            message.channel.sendMessage('Attempting to reboot VriskBot...');
            console.log(`Attempting to reboot VriskBot...`);
            if(error) return console.log(error);
            return;
            });
        return;
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
    timestamp();
    if(message.guild.id === '251182658720235521') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message from ${message.author.username} deleted in KKK3: \`${message}\``).catch(console.error);
        return;
    }
    if(message.guild.id === '258760772413292546') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message from ${message.author.username} deleted in YCD: \`${message}\``).catch(console.error);
        return;
    }
    if(message.guild.id === '260577188322082816') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message from ${message.author.username} deleted in Peace: \`${message}\``).catch(console.error);
        return;
    }
    if(message.guild.id === '196653602801057793') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message from ${message.author.username} deleted in Homestak: \`${message}\``).catch(console.error);
        return;
    }
    return;

}); 

bot.on('messageUpdate', (oldMessage, newMessage) => {

    if(oldMessage.author === bot.user) {
        return;
    }
    let reg = new RegExp("^(http|https)://", "i");
    let match = reg.test(oldMessage.content);
    if(match == true) {
        return;
    }

    timestamp();
    if(oldMessage.guild.id === '251182658720235521') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message edited by ${oldMessage.author.username} in KKK3, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    if(oldMessage.guild.id === '258760772413292546') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message edited by ${oldMessage.author.username} in YCD, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    if(oldMessage.guild.id === '260577188322082816') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message edited by ${oldMessage.author.username} in Peace, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    if(oldMessage.guild.id === '196653602801057793') {
        bot.channels.get('262959239427915776').sendMessage(`${datime}: Message edited by ${oldMessage.author.username} in Homestak, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    return;

}); 
//end message-delete and -edit events 




bot.login(config.tokenSelf);
console.log('Ready to initiate.');




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
