const { ids } = require("../../config")
module.exports = {
    name: "lock",
    description: "Lock the game-chat channel.",
    usage: `${process.env.PREFIX}lock`,
    hostOnly: true,
    run: async (message, args, client) => {
        let dayChat = message.guild.channels.cache.find((x) => x.name == "game-chat") // allowing players to speak in #day-chat
        dayChat.permissionOverwrites.edit(ids.player, {
            SEND_MESSAGES: true,
        })
        dayChat.send(`<@&${ids.player}>`)
        message.channel.send("Done")

    },
}