const { SlashCommandBuilder, Interaction } = require('discord.js');
const { guilds } = require('../guilds.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join-team')
        .setDescription('Join a team!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of team you want to join')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('password')
                .setDescription('If the team requires a password to join, type it here')
                .setRequired(false)),
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        const teamName = interaction.options.getString('name');
        const password = interaction.options.getString('password');
        const member = interaction.member;
        const user = interaction.user;
        interaction.reply(`${teamName} ${password}`);
    },
    /**
     * @param {Interaction} interaction 
     */
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [];

        guilds.filter(guild => guild.id == interaction.guild.id)[0].team_roles.forEach(team_role => {
            choices.push(team_role.team_name);
        });

        console.log(JSON.stringify(choices));
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}
