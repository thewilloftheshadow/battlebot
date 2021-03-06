const { ids } = require("../../config")
module.exports = {
    name: "unlock",
    description: "Unlock the day-chat channel.",
    usage: `${process.env.PREFIX}unlock`,
    hostOnly: true,
    run: async (message, args, client) => {
        let dayChat = message.guild.channels.cache.find((x) => x.name == "game-chat") // allowing players to speak in #day-chat
        dayChat.permissionOverwrites.edit(ids.player, {
            SEND_MESSAGES: true,
        })
        dayChat.send(`<@&${ids.player}>, check your private channels!`)
        message.channel.send("Done")
    },
}
