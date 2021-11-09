const db = require("quick.db")
const config = require("../config")
const { Collection, Util } = require("discord.js")
const cooldowns = new Collection()

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return
        let commandFile = client.slashCommands.get(interaction.commandName)

        if (!cooldowns.has(commandFile.name)) {
            cooldowns.set(commandFile.name, new Collection())
        }
        const now = Date.now()
        const timestamps = cooldowns.get(commandFile.name)
        const cooldownAmount = (commandFile.cooldown || 0) * 1000
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return interaction.reply({ content: `Please wait ${Math.ceil(timeLeft.toFixed(1))} more seconds before reusing the \`${commandFile.command.name}\` command.`, ephemeral: true })
            }
        }
        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

        let args = []
        if (interaction.options.data.lenght !== 0) {
            interaction.options.data.forEach((arg) => {
                let option = interaction.options.get(arg.name)
                args.push(option.value)
            })
        }
        if (!args[0]) args = ["None"]
        client.channels.cache.get("907359846381281310").send({ content: Util.removeMentions(`Slash command used: **${interaction.commandName}**\nArguments: **${args.join(" ")}**\nUser: ${interaction.user.tag} (${interaction.user.id})`) })
        await commandFile.run(interaction, client).catch((error) => {
            console.error(error)
            interaction.reply("An error has occured")
        })
    })
}
