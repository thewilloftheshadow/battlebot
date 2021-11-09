//648620

const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "playerinfo",
    description: "Get the playerinfo.",
    usage: `${process.env.PREFIX}playerinfo`,
    hostOnly: true,
    run: async (message, args, client) => {
        let content = ""
        let players = message.guild.roles.cache.find((r) => r.name === "Players").members
        players.forEach((p) => {
            content += `${p.displayName} (${p.user.tag})\n`
        })
        let embed = new Discord.MessageEmbed().setTitle("Playerinfo").setDescription(content).setColor("#648620")
        message.channel.send({ embeds: [embed] }).catch((e) => message.channel.send(`An error occured: ${e.message}`))
    },
}
