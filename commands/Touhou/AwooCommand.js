const commando = require('discord.js-commando');
const safebooru = require('../../safebooruImage2Channel');

class AwooCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'awoo',
            group: 'touhou',
            memberName: 'awoo',
            description: ''
        });
    }

    async run(message, args) {
        safebooru(message, "inubashiri_momiji");
    }
}

module.exports = AwooCommand;