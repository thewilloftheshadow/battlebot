const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { ids } = require("../../config")

module.exports = {
    name: "gwhost",
    description: "",
    usage: `${process.env.PREFIX}gwhost <game...>`,
    hostOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let m = await message.guild.channels.cache.find(x => x.name == "enter-game").send({ content: `@everyone, we are now starting game ${args.join(" ")}. Our host will be <@${message.author.id}>! Use the Join Game button above to join!`})
        db.set(`game`, m.id)
        db.set(`hoster`, message.author.id)
        db.set(`gamePhase`, -5)
    },
}
