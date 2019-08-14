const Discord = require('discord.js');
const client = new Discord.Client();

const { PREFIX: s! } = process.env;
const ids = ['362581648644243486', '339139148361498626'];

client.on('ready', () => {
	console.log('ready!');
	console.log(`tag: ${client.user.tag}`);
	client.user.setActivity('Mircale', { type: 'STREAMING', url: 'https://twitch.tv/DynastyShop' });
});

client.on('message', msg => {
	if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'setName') {
		if (ids.includes(msg.author.id)) return msg.channel.send('اظن انو هذا الامر ليس مسموح لك');
		const newName = args.join(' ');
		if (!newName) return msg.channel.send('**يرجي ادخال الاسم الجديد**');
		client.user.setUsername().catch(error => {
			console.error(error);
			return msg.channel.send('⚠ اسف ولكن حدث خطاء ما, يرجي التواصل مع صاحب السيرفر او مع مبرمجي');
		});
		return msg.channel.send(`\`${newName}\`` + ' **:لقد تم تغير اسمي الي**');
	} else if (command === 'setAvatar') {
		if (ids.includes(msg.author.id)) return msg.channel.send('اظن انو هذا الامر ليس مسموح لك');
		const newAva = msg.attachments.first().url || args.join(' ');
		if (!newAva) return msg.channel.send('**يرجي ادخال رابط الصورة او تحميلها مع الامر**');
		client.user.setAvatar(newAva).catch(error => {
			console.error(error);
			return msg.channel.send('⚠ اسف ولكن حدث خطاء ما, يرجي التواصل مع صاحب السيرفر او مع مبرمجي');
		});
		return msg.channel.send(`${newAva}` + ' **:لقد تم تغير صورتي الرمزية الي**');
	} else if (command === 'bc') {
		if (!msg.member.hasPermission('ADMINISTRATOR')) {
			return msg;
		}
		if (!args[0]) return msg.channel.send(`
** You have to add a text **
\`\`\`html
<${prefix}bc [message] : to send a dm to the online members >
<${prefix}bc embed [message] : To send a dm to all members with embed>
<${prefix}bc online [message] : To send a dm to the online members only>
<${prefix}bc idle [message] : To send a dm to the members who are idle>
<${prefix}bc dnd [message] : To send a dm to the members who are DND>
<${prefix}bc offline [message] : To send a dm to the offline members >
<${prefix}bc all [message] : To send a dm to all of the members>
\`\`\`
		`);

		const opt = args[0].toLowerCase();
		switch(opt) {
			case 'embed':
				return SendMessageEmbed(msg, args.slice(1).join(' '));
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
	if (!messageSending) return msg.channel.send('**Please add a text**');
	let filter;
	if (type === 'online') filter = member => member.presence.status === 'online' && !member.user.bot;
	else if (type === 'idle') filter = member => member.presence.status === 'idle' && !member.user.bot;
	else if (type === 'dnd') filter = member => member.presence.status === 'dnd' && !member.user.bot;
	else if (type === 'offline') filter = member => member.presence.status === 'offline' && !member.user.bot;
	else if (type === 'all') filter = member => member.presence.status !== 'offline' && !member.user.bot;
	else return;

	const members = msg.guild.members.filter(filter);
	if (members.size === 0) return msg.channel.send('**I could not find anyone with that status**');
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
			console.error(err.stack)
			++index;
		}
	});
	index = members.size - index;
	if (index === 0) return msg.channel.send('**I could not find any one with that status**');
	let str =`Sent the dm to  \`${index}\``;
	await msg.channel.send(index === 1 ? '**Sent to 1 member**' : (index === 2 ? '**Sent to 2 members **' : str));
}

async function SendMessageEmbed(msg, messageSending) {
	if (!messageSending) return msg.channel.send('**Please add a text**');
	const members = msg.guild.members.filter(member => member.presence.status !== 'offline' && !member.user.bot);
	if (members.size === 0) return msg.channel.send('**I could not find any one with that status**');
	let index = 0;
	const embed = new Discord.RichEmbed()
			.setColor('#ffae97')
			.setThumbnail(msg.guild.iconURL)
			.addField('⚪ From', msg.guild.name, true);
	members.forEach(member => {
		try {
			member.send(
embed.setAuthor(member.user.username, member.user.avatarURL).addField('⚪ To', member, true).addField('Message', messageSending.replace("[user]", member).replace("<user>", member), true)
				   );
			if (msg.attachments.first()) {
				member.send({
					files: [{
						attachment: msg.attachments.first().url,
						name: 'bc.png'
					}]
				});
			}
		} catch(err) {
			console.error(err.stack)
			++index;
		}
	});
	index = members.size - index;
	if (index === 0) return msg.channel.send('**لا استطيع ارسال الرسالة الي اي شخص لديه هذه الحالة**');
	let str = ` تم ارسال رسالتك الي \`${index}\``;
	await msg.channel.send(index === 1 ? '**تم ارسال رسالتك الي شخص واحد**' : (index === 2 ? '**تم ارسال رسالتك الي شخصين**' : str));
}
async function SendMessageAll(msg, messageSending) {
	if (!messageSending) return msg.channel.send('**من فضلك قم بكتابة الرسالة**');
	const members = msg.guild.members.filter(member => !member.user.bot);
	if (members.size === 0) return msg.channel.send('**يبدو انه لا يوجد احد في السيرفر, هذا يفسر لماذا لم اتمكن من اجد اي شخص في هذا السيرفر**');
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
			console.error(err.stack)
			++index;
		}
	});
	index = members.size - index;
	if (index === 0) return msg.channel.send('**لا يمكنني ان رسل هذه الرسالة الي اي شخص في هذا السيرفر**');
	let str = ` تم ارسال رسالتك الي \`${index}\``;
	await msg.channel.send(index === 1 ? '**تم ارسال رسالتك الي شخص واحد**' : (index === 2 ? '**تم ارسال رسالتك الي شخصين**' : str));
}

client.login(process.env.TOKEN);
