const Discord = require('discord.js');
const client = new Discord.Client();

const { PREFIX: prefix } = process.env;

client.on('ready', () => {
	console.log('Ready!');
	console.log(`tag: ${client.user.tag}`);
});

client.on('message', msg => {
	if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'bc') {
		if (!msg.member.hasPermission('ADMINISTRATOR ')) {
			return msg;
		}
		if (!args[0]) return msg.channel.send(`
** لم يتم تحديد اي مدخلات, من فضلك قم بادخال نوع الرسالة ومحتواها **
\`\`\`html
<${prefix}bc [message] : لارسال رسالة الي الاعضاء الاونلاين>
<${prefix}bc embed [message] : لارسال رسالة بامبد الي الاعضاء المتصلين, اي الذين ليسو اوفلاين>
<${prefix}bc online [message] : لارسال رسالة الي الاعضاء الاونلاين>
<${prefix}bc idle [message] : لارسال رسالة الي جيمع الاعضاء الخاملين>
<${prefix}bc dnd [message] : لارسال رسالة الي الاعضاء المشغولين>
<${prefix}bc offline [message] : لارسال رسالة الي الاعضاء الاوفلاين>
<${prefix}bc all [message] : لارسال رسالة الي جميع اعضاء السيرفر>
\`\`\`
		`);

		const opt = args[0].toLowerCase();
		switch(opt) {
			case 'online':
				return SendMessage(msg, 'online', args.slice(1).join(' '));
			case 'idle':
				return SendMessage(msg, 'idle', args.slice(1).join(' '));
			case 'dnd':
				return SendMessage(msg, 'dnd', args.slice(1).join(' '));
			case 'offline':
				return SendMessage(msg, 'offline', args.slice(1).join(' '));
			case 'all':
				return SendMessageAll(msg, args.slice(1).join(' '));
				
			default:
				return SendMessage(msg, 'all', args.join(' '));
		}
	}
});

async function SendMessage(msg, type, messageSending) {
	let filter;
	if (type === 'online') filter = member => member.presence.status === 'online' && !member.user.bot;
	else if (type === 'idle') filter = member => member.presence.status === 'idle' && !member.user.bot;
	else if (type === 'dnd') filter = member => member.presence.status === 'dnd' && !member.user.bot;
	else if (type === 'offline') filter = member => member.presence.status === 'offline' && !member.user.bot;
	else if (type === 'all') filter = member => member.presence.status !== 'offline' && !member.user.bot;
	else return;

	const members = msg.guild.members.filter(filter);
	let index = 0;
	members.forEach(member => {
		try {
			member.send(messageSending.replace("[user]", member).replace("<user>", member));
			if (msg.attachments.first()) {
				member.send({
					files: [{
						attachment: msg.attachments.first().url,
						name: 'bc.png'
					}]
				});
			}
		} catch(err) {
			++index;
		}
	});
	console.log(members.length)
	await msg.channel.send(`\`${members.length - index}\` تم ارسال رسالتك الي`);
}

async function SendMessageEmbed(msg, messageSending) {
	const members = msg.guild.members.filter(member => member.presence.status !== 'offline' && !member.user.bot);
	let index = 0;
	const embed = new Discord.RichEmbed()
			
	members.forEach(member => {
		try {
			member.send(messageSending.replace("[user]", member).replace("<user>", member));
			if (msg.attachments.first()) {
				member.send({
					files: [{
						attachment: msg.attachments.first().url,
						name: 'bc.png'
					}]
				});
			}
		} catch(err) {
			++index;
		}
	});
	await msg.channel.send(`\`${members.length - index}\` تم ارسال رسالتك الي`);
}
async function SendMessageAll(msg, messageSending) {
	const members = msg.guild.members.filter(member => !member.user.bot);
	let index = 0;
	members.forEach(member => {
		try {
			member.send(messageSending.replace("[user]", member).replace("<user>", member));
			if (msg.attachments.first()) {
				member.send({
					files: [{
						attachment: msg.attachments.first().url,
						name: 'bc.png'
					}]
				});
			}
		} catch(err) {
			++index;
		}
	});
	await msg.channel.send(`\`${members.length - index}\` تم ارسال رسالتك الي`);
}

client.login(process.env.TOKEN);
