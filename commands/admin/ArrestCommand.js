const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');
const updateDB = require('../../db/DBUpdateGuildSetting').ban;
const {guild, keys, syncGuild} = require('../../db/JSONSListeners');

class ArrestCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'arrestar',
            group: 'admin',
            memberName: 'arrestar',
            aliases: ["arrest"],
            description: 'Banear temporalmente a un usuario sin expulsarlo del servidor.\n' +
                'A diferencia del metodo de baneos interno de Discord, yo no expulso al usuario del canal, en cambio, ' +
                'le asigno un rol, el cual le eliminaré pasado un tiempo definido. Asegurate de indicarme que rol ' +
                'debo usar para los arrestos y de quitarle los permisos a ese rol para que no pueda acceder a los canales ' +
                'del servidor, excepto por la `prisión`, si así lo deseas.\n' +
                'La duración indica cuanto tiempo (en minutos) el usuario estará arrestado. una vez cumplido este tiempo, ' +
                'me encargaré de quitarle el rol asignado para los arrestos.\n' +
                'Si quieres que el arresto sea cadena perpetua, o decidir manualmente cuando levantaras el arresto, indica ' +
                'una duración de 0 minutos.\n' +
                'Para remover manualmente un arresto, utiliza la función `libertad`\n\n***La duración no es exacta, la liberacion ' +
                'automática puede tardar hasta 2 minutos en efectuarse.',
            examples: ['arrestar <@386007907113762816> 1', 'arrestar <@386007907113762816> 60 ¡Por ser genial!'],
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES', 'EMBED_LINKS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'usuario',
                    prompt: '¿A quién debo banear?',
                    type: 'member',
                }
                ,
                {
                    key: 'duracion',
                    prompt: '¿Cuanto durará el ban (en minutos)?\nSi el baneo es indefinído, indica 0 minutos.',
                    type: 'integer',
                    min: 0
                }
                ,
                {
                    key: 'razon',
                    prompt: '¿Por qué está siendo baneado?',
                    type: 'string',
                    max: 2000,
                    default: "No explicitada"
                }
            ]
        });
    }

    async run(message, args) {
        let guild_data = await guild(message.guild.id);
        if (!guild_data) return;

        let ban_public_notification_channel = message.guild.channels.cache.find(x => x.id === guild_data[keys.ban_public_notification_channel]);
        let ban_channel = message.guild.channels.cache.find(x => x.id === guild_data[keys.ban_channel_id]);
        let ban_role = message.guild.roles.cache.find(x => x.id === guild_data[keys.ban_role_id]);

        if (!ban_role) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                message.reply("No se ha configurado ningun rol para realizar baneos, por favor, configurame un rol " +
                    "para baneos, para ayudarte en esta tarea.");

            } else {
                message.reply("No se ha configurado ningun rol para realizar baneos. Pidele a algún administrador " +
                    "que configure esta propiedad.");
            }
            return;
        }

        let time;
        let start = Date.now();
        let startString = moment(start).format('DD/MM/YYYY h:mm:ss');
        let end;
        let endString;

        if (args.duracion) {
            time = args.duracion + " minutos";
            end = Date.now() + args.duracion * 60000;
            endString = moment(end).format('DD/MM/YYYY h:mm:ss');
        } else {
            time = "Indefinido";
            end = null;
            endString = "Indefinido";
        }

        updateDB(args.usuario.user.id, message.guild.id, start, end, args.razon, ban_role.id)
            .then(() => {
                args.usuario.roles.add(ban_role)
                    .then(async () => {
                        let embed = new Discord.MessageEmbed()
                            .setTitle('Usuario Baneado')
                            .setThumbnail(args.usuario.user.displayAvatarURL())
                            .addField('Usuario', args.usuario.user.username, true)
                            .addField('Duración', time, true)
                            .addField('Razón', args.razon, false)
                            .addField('Hora del baneo', startString, true)
                            .addField('Hora de termino', endString, true)
                            .setColor("#FF0000");
                        if (ban_public_notification_channel) {
                            ban_public_notification_channel.send(embed);
                        }
                        if (ban_channel) {
                            ban_channel.send(args.usuario.toString() + ", lo siento, pero has sido baneado/a.", embed);
                        }
                        message.reply("¡Usuario \"baneado\" exitosamente!");
                    });
            }).catch(() => {
            message.reply("Por alguna razón, no he podido realizar el baneo, si este problema persiste, informale al desarrollador a traves del comandos `feedback`");
        });
    }
}

module.exports = ArrestCommand;
