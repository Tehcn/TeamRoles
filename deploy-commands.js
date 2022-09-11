const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { BOT_TOKEN_ENCRYPTED, CLIENT_ID } = require('./config.json');
const { GUILDS } = require('./guilds.json');
const fs = require('node:fs');
const crypto = require('./crypto');

const BOT_TOKEN = crypto.decrypt(BOT_TOKEN_ENCRYPTED, process.argv[2]);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}


const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands`);

        GUILDS.forEach(async guild => {
            const data = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guild.id),
                { body: commands }
            );

            console.log(`Successfully reloaded ${commands.length} application (/) commands for guild ${guild.name}.`);
        });

        console.log(`Successfully reloaded application (/) commands for ${GUILDS.length} guilds.`);
    } catch (error) {
        console.error(error);
    }
})();