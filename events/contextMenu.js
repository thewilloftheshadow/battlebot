const db = require("quick.db")
const { ids } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isContextMenu()) return
        console.log(interaction)
        if (interaction.guild.id == ids.server.game) {
            let action = interaction.commandName
            let user = interaction.options.getMember("user")
            let gamelobby = interaction.guild.channels.cache.find((c) => c.name === "game-lobby")

            if (action == "Spectate") {
                if (!interaction.member.roles.cache.has(ids.mini) && !interaction.member.roles.cache.has(ids.narrator)) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
                if (!user.roles.cache.has("691298564508352563")) {
                    user.setNickname("lazy spectatorz")
                } else {
                    user.setNickname(user.user.username)
                }
                user.roles.add(ids.spectator)
                if (user.roles.cache.has(ids.alive)) user.roles.remove(ids.alive) //alive
                interaction.reply({ content: "Done!", ephemeral: true })
                gamelobby.send(`${user.user.tag} is now spectating the game!`)
            }
        }
    })
}
