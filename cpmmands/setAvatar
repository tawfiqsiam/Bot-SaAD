const { Command } = require('discord-akairo');
const { PREFIX: prefix } = process.env;

class SetNameCommand extends Command {
    constructor() {
        super('setavatar', {
            aliases: ['setavatar'],
            channelRestriction: 'guild',
            ownerOnly: true
        });
    }

    exec(msg) {
        const args = msg.content.slice(prefix.length).split(/ +/);
        const newAva = msg.attachments.first().url || args.join(' ');
		if (!newAva) return msg.channel.send('**يرجي ادخال رابط الصورة او تحميلها مع الامر**');
		client.user.setAvatar(newAva);
		return msg.channel.send(`${newAva}` + ' **:لقد تم تغير صورتي الرمزية الي**');
    }
}

module.exports = SetNameCommand;
