const { MessageActionRow } = require("discord.js")
const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "reset",
    description: "Reset the database.",
    usage: `${process.env.PREFIX}reset`,
    run: async (message, args, client) => {
        console.log("hi")
        if (message.member.roles.cache.has(ids.host)) {
            let times = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000]
            times = times[Math.floor(Math.random() * times.length)]

            db.delete(`excludes`)

            message.guild.channels.cache
                .find((x) => x.name == "game-chat")
                .permissionOverwrites.edit(ids.player, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })

            message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(ids.player, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            message.guild.channels.cache
                .find((x) => x.name == "game-lobby")
                .permissionOverwrites.edit(ids.player, {
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            message.guild.members.cache.filter((x) => x.roles.cache.has(ids.player)).forEach((x) => x.roles.remove(ids.player))
            message.guild.members.cache.filter((x) => x.roles.cache.has(ids.spectator)).forEach((x) => x.roles.remove(ids.spectator))

            const temproles = message.guild.channels.cache.find((x) => x.name == "private channels")
            temproles.children.forEach((channel) => channel.delete())

            message.channel
                .send("Reset in progress")
                .then((msg) => {
                    setTimeout(function () {
                        msg.edit("Reset complete").catch((e) => message.channel.send(`Error: ${e.message}`))
                    }, times)
                })
                .catch((e) => message.channel.send(`Error: ${e.message}`))
        }
    },
}
