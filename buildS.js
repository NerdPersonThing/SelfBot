function everything() {

const trigger = '&';
const version = 'S1.0.7';

const config = require('../configSelf.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
var exec = require('child_process').exec;
var sleep = 0;
var downshut = 0;

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
  ["tableflip", "(╯°□°）╯︵ ┻━┻"]
]);



bot.on('message', (message) => {

    if(message.author !== bot.user) {
        return;
    }
    
    var origmsg = message.content;
    message.content = message.content.toLowerCase();
    
    if(downshut === 1) {
        if(message.content === 'y') {
            shutdown();
        } else if(message.content === 'n') {
            message.channel.sendMessage('That was a close one!');
            console.log('Shutdown canceled.');
            downshut = 0
            return;
        } else {
            return;
        }
    }


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

    console.log(`Me: "${message.content}"`);

    
    
    if(cmd === 'selfhelp') {
        setTimeout( () => { message.edit('prune, purge, test, myid, setgame, nick, sleep, shutdown, vriskbotreboot, vriskbotshutdown, vriskbotstart, update, [shortcuts]') }, 50);
    }
    
    if(cmd === 'prune') {
        let messagecount = parseInt(args[0]);
        message.channel.fetchMessages({limit: 100})
        .then(messages => {
            let msg_array = messages.array();
            msg_array = msg_array.filter(m => m.author.id === bot.user.id);
            msg_array.length = messagecount + 1;
            msg_array.map(m => m.delete().catch(console.error));
        }).catch(console.error);
    }

    if(cmd === 'purge') {
        let messagecount = parseInt(args[0]);
        message.channel.fetchMessages({limit: messagecount + 1})
        .then(messages => {
            messages.map(m => m.delete().catch(console.error));
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
    

    if(cmd === 'help') {
        setTimeout( () => { message.edit(`null`) }, 50);
        return;
    }

    if(cmd === 'setgame') {
        let game = origargs.join(" ");
        bot.user.setStatus(null, game);
        message.delete().catch(console.error);
        return;
    }

    if(cmd === 'nick') {

    }

    if(cmd === 'sleep') {
        setTimeout( () => { message.edit('I\'m totally normal.') }, 50);
        sleep = 1
        return;
    }

    if(cmd === 'shutdown') {
        message.channel.sendMessage('Are you sure you want to shut down the bot? Y/N');
        downshut = 1
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

            setTimeout( () => { message.edit(`:arrow_right: CODE: \n\n \`${code}\`\n\n:white_check_mark: RESULT: \n\n\`${evaled}\``) }, 50);
            return;
        } catch(err) {
            setTimeout( () => { message.edit(`:arrow_right: CODE: \n\n \`${code}\`\n\n:octagonal_sign: ERROR: \n\n\`${err}\``) }, 50);
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
    if(message.guild.id === '251182658720235521') {
        bot.channels.get('262959239427915776').sendMessage(`Message deleted from ${message.author.username} in KKK3: \`${message}\``).catch(console.error);
        return;
    }
    if(message.guild.id === '258760772413292546') {
        bot.channels.get('262959239427915776').sendMessage(`Message deleted from ${message.author.username}in YCD: \`${message}\``).catch(console.error);
        return;
    }
    return;

});

bot.on('messageUpdate', (oldMessage, newMessage) => {

    if(oldMessage.author === bot.user) {
        return;
    }
    if(oldMessage.guild.id === '251182658720235521') {
        bot.channels.get('262959239427915776').sendMessage(`Message edited from ${oldMessage.author.username} in KKK3, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    if(oldMessage.guild.id === '258760772413292546') {
        bot.channels.get('262959239427915776').sendMessage(`Message edited from ${oldMessage.author.username} in YCD, from \`${oldMessage}\` to \`${newMessage}\``).catch(console.error);
        return;
    }
    return;

}); 





bot.login(config.tokenSelf);
console.log('Ready to initiate.');




bot.on('ready', () => {
    console.log('Selfbot is up and running. Press CTRL+C to stop...');
    bot.channels.get('262249669692882946').sendMessage(`Selfbot online, version ${version}.`);

}); //end readylog



function shutdown() {
    console.log('Shutdown commencing...');
    process.exit(1);
    }




} //end everything();
everything();
