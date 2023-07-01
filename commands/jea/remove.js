const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { JsonDB, Config } = require('node-json-db');
var db = new JsonDB(new Config("dendadb", true, false, '/'));

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
    .setName('remove')
    .setDescription('remove denda')
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('denda id')
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
      let id = interaction.options.getString('id');
      db.reload()
      const jea = await db.getData("/denda")

      const id2 = jea[id];
      let amount = id2.amount;
      let memberaxa = id2.member.userId;
      let message = id2.message;
      let reason = id2.reason;
      let omdkuolen = await interaction.guild.members.fetch(memberaxa);
      if (omdkuolen != undefined)
        omdkuolen.roles.remove("1116480845067321424").catch(console.error);

      const channel = interaction.guild.channels.cache.get('1116467518672998462');
      const fetchedMessage = await channel.messages.fetch(message);
      fetchedMessage.delete();

      const embed2 = new EmbedBuilder()
        .setColor('#2f3136')
        .setTitle('teambag denda logs')
        .setDescription(`${interaction.user} removed <@${memberaxa}>'s denda, denda reason ${reason}, id ${id}`)
        .setTimestamp();

      await interaction.guild.channels.cache.get('1119701179539144754').send({ embeds: [embed2] });
      await db.delete(`/denda/${id}`);
      await interaction.reply({ content: `removed ${amount}dls denda from <@${memberaxa}>`, ephemeral: true });
    }
};