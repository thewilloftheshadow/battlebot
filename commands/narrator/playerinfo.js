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
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive").members.size
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead").members.size
        let c = message.guild.channels.cache.filter((c) => c.name.startsWith("priv"))
        let ch = c.map((x) => x.id)
        for (let i = 1; i <= alive + dead; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
            if (!guy) return message.channel.send("Something went wrong... Make sure that all of the players only have 1 role (Alive or Dead)!")
            for (let b = 0; b < ch.length; b++) {
                let cha = message.guild.channels.cache.find((channel) => channel.id === ch[b])
                if (cha.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    let ro = cha.name.replace("priv-", "")
                    content += `${guy.nickname}. ${guy.user.tag}\n`
                }
            }
        }
        let embed = new Discord.MessageEmbed().setTitle("Playerinfo").setDescription(content).setColor("#648620")
        message.channel.send({ embeds: [embed] }).catch((e) => message.channel.send(`An error occured: ${e.message}`))
    },
}
