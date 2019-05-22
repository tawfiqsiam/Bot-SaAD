const { Command } = require('discord-akairo');
const { PREFIX: prefix } = process.env;

class SetNameCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['bc'],
            channelRestriction: 'guild',
            ownerOnly: true
        });
    }

    exec(msg) {
        if (ids.includes(msg.author.id)) return msg.channel.send('اظن انو هذا الامر ليس مسموح لك');
        const newName = args.join(' ');
        if (!newName) return msg.channel.send('**يرجي ادخال الاسم الجديد**');
        client.user.setUsername();
        return msg.channel.send(`\`${newName}\`` + ' **:لقد تم تغير اسمي الي**');
    }
}

module.exports = SetNameCommand;
