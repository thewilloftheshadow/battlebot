const { ids } = require("../../config")

let sentMessage = (sentMessage) => sentMessage.react
module.exports = {
    name: "sow",
    description: "Send vote for start or wait.",
    usage: `${process.env.PREFIX}sow`,
    hostOnly: true,
    run: async (message, args, client) => {
        let channel = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        message.delete()
        let m = await channel.send(`<@&${ids.player}> Start or Wait?`)
        await m.react("👍")
        await m.react("👎")
    },
}
