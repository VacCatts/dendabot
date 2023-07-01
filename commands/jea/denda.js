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
  '1116472098697781249'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('denda')
    .setDescription('give denda')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('user to give denda to')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
        .setName('amount')
        .setDescription('amount of denda in dls')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
        .setName('reason')
        .setDescription('denda reason')
        .setRequired(true)
    ),

    async execute(interaction) {
      const { member } = interaction;
      await member.fetch();
      const hasAllowedRole = member.roles.cache.some(role => allowedRoleIds.includes(role.id));

      if (!hasAllowedRole) {
        await interaction.reply({ content: `You are not authorized to use this command.`, ephemeral: true });
        return;
      }    
      let memberaxa = interaction.options.getMember('user');
      let amount = interaction.options.getInteger('amount');
      let reason = interaction.options.getString('reason');
      let idjea = "denda_" + makeid(4).toLowerCase()
      if (member != undefined)
        member.roles.add("1116480845067321424").catch(console.error);

      const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setTitle('teambag denda')
        .setDescription(`${interaction.user} gave ${amount}dls denda to ${memberaxa} for reason ${reason}, id ${idjea}`)
        .setTimestamp();

      const channel = interaction.guild.channels.cache.get('1116467518672998462');
      
      const message = await channel.send({ embeds: [embed] });
      const sentMessage = await channel.send(`${memberaxa}`);
      setTimeout(() => {
        sentMessage.delete();
      }, 250);

      db.reload()
      await db.push("/denda/" + idjea, {
        amount: amount,
        reason: reason,
        date: moment().format('yyyy-mm-dd:hh:mm:ss'),
        issuer: interaction.user.id,
        member: memberaxa,
        message: message.id
      }, false);

      embed.setTitle("teambag denda logs")
      await interaction.guild.channels.cache.get('1119701179539144754').send({ embeds: [embed] });

      await interaction.reply({ content: `gave ${amount}dls denda to ${memberaxa} for reason ${reason}`, ephemeral: true });
    }
};