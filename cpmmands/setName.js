const { Command } = require('discord-akairo');
const { PREFIX: prefix } = process.env;

class SetNameCommand extends Command {
    constructor() {
        super('setname', {
            aliases: ['setname'],
            channelRestriction: 'guild',
            ownerOnly: true
        });
    }

    exec(msg) {
        const args = msg.content.slice(prefix.length).split(/ +/);
        const newName = args.join(' ');
        if (!newName) return msg.channel.send('**يرجي ادخال الاسم الجديد**');
        client.user.setUsername();
        return msg.channel.send(`\`${newName}\`` + ' **:لقد تم تغير اسمي الي**');
    }
}

module.exports = SetNameCommand;
