const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { JsonDB, Config } = require('node-json-db');
var db = new JsonDB(new Config("dendadb", true, false, '/'));

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
    .setName('list')
    .setDescription('list of all denda'),
    async execute(interaction) {
      const { member } = interaction;
      await member.fetch();
      const hasAllowedRole = member.roles.cache.some(role => allowedRoleIds.includes(role.id));

      if (!hasAllowedRole) {
        await interaction.reply({ content: `You are not authorized to use this command.`, ephemeral: true });
        return;
      }
      db.reload()
      const jea = await db.getData("/denda")

      const names = [];
      const amounts = [];
      const reasons = [];
      const dates = [];
      const issuers = [];
      const ids = [];

      for (const userName in jea) {
        if (jea.hasOwnProperty(userName)) {
          const id = jea[userName];
          const amount = id.amount;
          const reason = id.reason;
          const date = id.date;
          const issuer = id.issuer;
          const member = id.member.userId;

          // Push the values into the respective arrays
          names.push(member);
          amounts.push(amount);
          reasons.push(reason);
          dates.push(date);
          issuers.push(issuer);
          ids.push(userName);
        }
      }

      let stringgi = ""

      for (let i = 0; i < names.length; i++) {
        stringgi += `<@${names[i]}>\n- Amount: ${amounts[i]}dls\n- Reason: ${reasons[i]}\n- Date: ${dates[i]}\n- Issuer: <@${issuers[i]}>\n- ID: ${ids[i]}\n\n`
      }

      const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setTitle('denda list')
        .setDescription(stringgi)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true});
    }
};