const commando = require('discord.js-commando');
const safebooru = require('../../safebooruImage2Channel');

class YuyukoCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'yuyuko',
            group: 'touhou',
            memberName: 'yuyuko',
            description: ''
        });
    }

    async run(message, args) {
        safebooru(message, "saigyouji_yuyuko");
    }
}

module.exports = YuyukoCommand;