const { JsonDB, Config } = require('node-json-db');
const { EmbedBuilder } = require('discord.js');
var db = new JsonDB(new Config("dendadb", true, false, '/'));

function doesIdExist(databaseId, data = null) {
    if (!data) {
      try {
        data = db.getData('/users');
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  
    if (typeof data === 'object') {
      if (data.hasOwnProperty(databaseId)) {
        return true;
      }
  
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (typeof value === 'object') {
            if (doesIdExist(databaseId, value)) {
              return true;
            }
          }
        }
      }
    }
  
    return false;
  }

module.exports = {
    async exec(id, client) {
        try {
            db.reload()
            const jea = await db.getData("/denda")

            console.log(id);
    
            const id2 = jea[id];
            const memb = id2.member.userId; 
            let message = id2.message;
            let reason = id2.reason
        
            const guild = client.guilds.cache.get('1116462951856083044');
            let omdkuolen = await guild.members.fetch(memb);
            if (omdkuolen != undefined) {
                omdkuolen.roles.remove("1116480845067321424").catch(console.error());
            }
        
            const channel = guild.channels.cache.get('1116467518672998462');
            const fetchedMessage = await channel.messages.fetch(message);
            fetchedMessage.delete();

            const embed2 = new EmbedBuilder()
              .setColor('#2f3136')
              .setTitle('teambag denda logs')
              .setDescription(`denda bot removed <@${memb}>'s denda, denda reason ${reason}, id ${id}`)
              .setTimestamp();
    
            await guild.channels.cache.get('1119701179539144754').send({ embeds: [embed2] });
            await db.delete(`/denda/${id}`);
        } catch (error) {
            console.log(error)
        }
    },

    async get(id, res) {
        try {
            db.reload()
            const jea = await db.getData("/denda")
    
            const id2 = jea[id];
            const amount = id2.amount;
            console.log('' + amount)
            res.send('' + amount)
        } catch (error) {
            console.log(error)
        }
    },
    async daily(id, client, reme) {
        try {
            const retardation = '' + id
            const data = await db.getData('/id/' + retardation);
            let userId = data.user
        
            // Give the role (Replace 'roleId' with your desired role ID)
            const guild = await client.guilds.fetch("1116462951856083044");
            const member = await guild.members.fetch(userId);
        
            if (!member) {
                console.log(`Member with ID '${userId}' not found.`);
                return;
            }
        
            if (member.roles.cache.has("1117312120980242514")) {
                console.log('Member already has the role.');
                return;
            }
        
            if (reme) {
                member.roles.add("1117332059954880515")
                member.send(`Paid reme daily successfully!`);
                console.log(`Reme daily role granted to member with ID: ${userId}`);
            } else {
                member.roles.add("1117312120980242514")
                member.send(`Paid daily successfully!`);
                console.log(`role granted to member with ID: ${userId}`);
            }
    
            // Schedule role removal after the specified duration
            setTimeout(() => {
                member.roles.remove("1117312120980242514")
                .then(() => {
                    member.send(`Your daily ran out`);
                })
                .catch(console.error);
            }, 24 * 60 * 60 * 1000);
            // 15 * 1000
        } catch (error) {
            console.error(error);
        }
    }
}