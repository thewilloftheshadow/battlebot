const { MessageActionRow } = require("discord.js")
const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "cancel",
    description: "Cancel a game.",
    usage: `${process.env.PREFIX}cancel`,
    hostOnly: true,
    run: async (message, client, args) => {
        if (db.get(`game`) == null) return message.channel.send("No game is being hosted")
        message.guild.channels.cache.find((c) => c.name === "enter-game").send(`Game was canceled. Sorry for the inconvenience!`)
        db.delete(`game`)
    },
}
