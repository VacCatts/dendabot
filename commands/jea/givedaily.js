const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
let isCommandRunning = false;
const { JsonDB, Config } = require('node-json-db');
var db = new JsonDB(new Config("dendadb", true, false, '/'));
var moment = require('moment');

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const allowedRoleIds = [
    '1116476296399171624',
    '1116476241848053820',
    '1116475867309289532',
    '1116478858301014056',
    '1116472098697781249',
    "1116476338937810944",
    "1116480618335830117",
    "1116480845067321424"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('givedaily')
    .setDescription('give daily'),
    async execute(interaction) {
        const { member } = interaction;
        await member.fetch();
        const hasAllowedRole = member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasAllowedRole) {
            await interaction.reply({ content: `You are not authorized to use this command.`, ephemeral: true });
            return;
        }    

        // Store the ID in the database
        db.push(`/id/${idjea}/user`, interaction.user.id);
        await interaction.reply({ embed: embed, ephemeral: true })
    }
};