const Discord = require('discord.js');
const commando = require('discord.js-commando');
const bot = new commando.Client(); //commando bot


//GLOBAL VARIABLES
// Banned tags for image search

bot.registry.registerGroup('admin', 'Admin');
bot.registry.registerGroup('misc', 'Misc');
bot.registry.registerGroup('comun', 'Comun');
bot.registry.registerGroup('touhou', 'Touhou');
bot.registry.registerGroup('personalizado', 'Personalizado');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.on('message',function (message) {
    if (message.author.username.toString()!=='HouraiESP') {
        console.log(message.author.username + ": " + message.toString());
    }
});

bot.on("guildMemberAdd",function(member){
    let chan = member.guild.channels.find("id","386366248306343937");
    chan.send(member.user.username +" se ha unido al servidor.");
});

bot.on("guildMemberRemove",function(member){
    let chan = member.guild.channels.find("id", "386366248306343937");
    chan.send(member.user.username +" ha dejado el servidor.");
});

bot.on("voiceStateUpdate", function (oldMember, newMember) {
    let chan = newMember.guild.channels.find("id","385996736990281730");
    let nombre = "**"+oldMember.user.username+"**";
    let oldChannel = oldMember.voiceChannelID;
    let newChannel = newMember.voiceChannelID;
    if (oldChannel){
        if(newChannel){
            let oldChannelName = "**"+newMember.guild.channels.find("id",oldChannel+"").name+"**";
            let newChannelName = "**"+newMember.guild.channels.find("id",newChannel+"").name+"**";
            if (oldChannelName !== newChannelName){
                chan.send(nombre+" se ha movido de "+oldChannelName+" a "+newChannelName);
            }
        }else {
            let oldChannelName = "**"+newMember.guild.channels.find("id",oldChannel+"").name+"**";
            chan.send(nombre+" se retiró de "+oldChannelName);
        }
    } else {
        let newChannelName = "**"+newMember.guild.channels.find("id",newChannel+"").name+"**";
        chan.send(nombre+" se unió a "+newChannelName);
    }

});

bot.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.connect();
});

function conectarBot() {
    bot.login(process.env.BOT_TOKEN1).then(function () {
        console.log("Bot conectado");
        bot.user.setUsername("HouraiESP");
    }).catch(function () {
        console.log("bot no conectado");
        setTimeout(function () {
            console.log("reintentado conectar Bot");
            conectarBot();
        },5000);
    });
}

conectarBot();
