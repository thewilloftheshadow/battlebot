const { MessageActionRow } = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getEmoji } = require("../../config")

module.exports = {
    name: "startgame",
    description: "Start the game.",
    usage: `${process.env.PREFIX}startgame`,
    hostOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        if (mid) {
            message.guild.channels.cache
                .find((x) => x.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    let narrbutton = row.components[2]
                    jgbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton, narrbutton)] })
                })
        }

        // changing perms for alive in game-lobby
        message.guild.channels.cache.find((c) => c.name === "game-lobby").send("Game starting in 5 ...")

        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("4")
        }, 1000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("3")
        }, 2000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("2")
        }, 3000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("1")
        }, 4000)
        setTimeout(async () => {
            message.guild.channels.cache
                .find((c) => c.name === "game-lobby")
                .permissionOverwrites.edit(ids.player, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })
        }, 5000)

        message.guild.channels.cache
            .find((c) => c.name === "game-chat")
            .permissionOverwrites.edit(ids.player, {
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: true,
                VIEW_CHANNEL: true,
            })

        
        message.channel.send("The game has started! Use +unlock and +lock to control the game chat.")
        await client.channels.cache.find((c) => c.id === "606123818305585167").send("Game is starting. You can no longer join. Feel free to spectate!")
        let gamemode = db.get(`gamemode`)
        message.guild.channels.cache.find((x) => x.name == "enter-game").send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)
        db.set("started", "yes")
        db.delete(`gamemode`)
    },
}
