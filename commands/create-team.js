const { SlashCommandBuilder, Interaction } = require('discord.js');
const fs = require('node:fs');
const { sha256 } = require('../crypto');
const { hexToRGBArray } = require('../utils');
const { guilds, $schema, guild_ids } = require('../guilds.json');

const DEFAULT_COLORS = {
    RED: '#ff0000',
    ORANGE: '#ff7f00',
    YELLOW: '#ffff00',
    GREEN: '#00ff00',
    BLUE: '#0000ff',
    PURPLE: '#6a0dad',
    GRAY: '#808080',
    GREY: '#808080',
    BLACK: '#000000'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-team')
        .setDescription('Creates a team with you as the leader!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Your team\'s name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Your team\'s color (can use hexidecimal values for custom colors. ex: #0077ff)')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('password')
                .setDescription('A password required to join your team')
                .setRequired(false)),
    /**
     * @param  {Interaction} interaction
     */
    async execute(interaction) {
        let guild = interaction.guild;
        let user = interaction.user;
        let team_id = sha256(interaction.options.getString('name'));

        let guild_team_data = guilds.filter(guildt => guildt.id === guild.id)[0];
        let teamWithSameNameAlreadyExists = guild_team_data.team_roles.filter(team => team.team_id === team_id).length !== 0;

        if (teamWithSameNameAlreadyExists) {
            interaction.reply('Name already taken!');
            return;
        }

        let team = {
            team_name: interaction.options.getString('name'),
            team_color: interaction.options.getString('color').startsWith('#')
                ? interaction.options.getString('color')
                : DEFAULT_COLORS[interaction.options.getString('color').toUpperCase()],
            team_id: team_id,
            team_password: interaction.options.getString('password') != null
                ? interaction.options.getString('password')
                : '',
            team_members: {
                admin: [
                    {
                        name: user.tag,
                        team: team_id
                    }
                ],
                normal: []
            },
            team_leader: {
                name: user.tag,
                team: team_id
            }
        };

        let role = await guild.roles.create({
            name: team.team_name,
            color: hexToRGBArray(team.team_color),
            hoist: true,
            mentionable: true,
            reason: `User ${interaction.user.tag} created a team`
        });

        let roleData = { user: user, role: role, reason: `User ${user.tag} created a team ${team.team_id}` }

        guild.members.addRole(roleData);

        guild_team_data.team_roles.push(team);

        let gidx = guilds.findIndex(guildt => guildt.id === guild_team_data.id)

        guilds[gidx] = guild_team_data;

        console.log(`User ${user.tag} created a team ${team.team_id}`);

        const finalJSON = {
            "$schema": $schema,
            "guild_ids": guild_ids,
            "guilds": guilds
        };

        fs.writeFileSync('./guilds.json', JSON.stringify(finalJSON, null, 4));

        await interaction.reply(`Created team ${team.team_name}!`);
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'grey', 'black'];
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
};