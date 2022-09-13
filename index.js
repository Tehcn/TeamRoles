const crypto = require('./crypto');
const config = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, InteractionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

const BOT_TOKEN = crypto.decrypt(config.BOT_TOKEN_ENCRYPTED, process.argv[2]).toString();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(`user ${interaction.user.tag} from guild ${interaction.guild.name} used the command ${interaction.commandName}`);

    const command = interaction.client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;
    console.log(`user ${interaction.user.tag} from guild ${interaction.guild.name} is attempting to autocomplete the command ${interaction.commandName} on option ${interaction.options.getFocused(true).name} with data ${interaction.options.getFocused()}`);
    const command = interaction.client.commands.get(interaction.commandName);
    try {
        await command.autocomplete(interaction);
    } catch (error) {
        console.error(error);
        await interaction.respond([{ name: 'An Error Occurred... ', value: 'seriously' }]);
    }
});

client.login(BOT_TOKEN);