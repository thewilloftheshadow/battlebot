const { MessageActionRow, MessageButton } = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const { ids } = require("../config")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customId)
        if (interaction.customId == "igjoin") {
            let guy = interaction.member
            if (guy.roles.cache.has(ids.spectator)) guy.roles.remove(ids.spectator) 
            if (guy.roles.cache.has(ids.host)) guy.roles.remove(ids.host)
            let role = interaction.guild.roles.cache.get(ids.player)
            await guy.roles
                .add(ids.player)
                .then((g) => g.setNickname(role.members.size.toString()).catch((e) => interaction.reply(`Error: ${e.message}`)))
                .catch((e) => interaction.reply(`Error: ${e.message}`))
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} joined the game!`)
            interaction.deferUpdate()
        }
        if (interaction.customId == "igspec") {
            let guy = interaction.member
            guy.setNickname("lazy spectatorz")
            guy.roles.add(ids.spectator)
            if (guy.roles.cache.has(ids.player)) guy.roles.remove(ids.player) 
            if (guy.roles.cache.has(ids.host)) guy.roles.remove(ids.host) 
            interaction.deferUpdate()
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} is now spectating the game!`)
        }
        if (interaction.customId == "ighost") {
            if (!interaction.member.roles.cache.has(ids.hostteam)) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            if (interaction.member.roles.cache.has(ids.hostteam)) {
                interaction.member.roles.add(ids.host)
            }
            interaction.deferUpdate()
        }

        if (interaction.customId.startsWith("gp")) {
            let cmd = interaction.customId.split("-")[1]
            switch (cmd) {
                case "request":
                    let canHost = new MessageButton().setLabel("I can host").setStyle("SUCCESS").setCustomId(`hostrequest-yes;`)
                    let canNotHost = new MessageButton().setLabel("No one can host").setStyle("DANGER").setCustomId(`hostrequest-no;`)
                    let nextTime = db.get("nextRequest")
                    if (nextTime && nextTime > Date.now()) return interaction.reply({ content: `A game can only be requested once per every 30 minutes! The next game can be requested <t:${Math.round(nextTime / 1000)}:R>`, ephemeral: true })
                    canHost.customId += interaction.member.id
                    canNotHost.customId += interaction.member.id
                    const row = new MessageActionRow().addComponents(canHost, canNotHost)
                    client.channels.cache.get("907369493242720328").send({ content: `${interaction.member} is requesting a game! ||@here||\n\nThe below buttons will send a DM to the requesting user about your choice.`, components: [row] })
                    interaction.reply({ content: "Your request has been sent to the host team!", ephemeral: true })
                    db.set("nextRequest", Date.now() + ms("30m"))
                    break
                case "stats":
                    interaction.reply({ content: `The last gamemode was ${db.get("gamemode")}.`, ephemeral: true })

                default:
                    break
            }
        }
        //hostrequest-no;1920765935063
        if (interaction.customId.startsWith("hostrequest")) {
            let cmd = interaction.customId.split("-")[1]
            let [action, user] = cmd.split(";")
            foundUser = interaction.guild.members.resolve(user)
            switch (action) {
                case "no":
                    foundUser.send({ content: `Hey there, we received your request for a game! Unfortunately, no one is able to host a game right now.` })
                    interaction.reply({ content: `No one can host, so the user has been informed. Thank you ${interaction.member}` })
                    break
                case "yes":
                    foundUser.send({ content: `Hey there, we received your request for a game, so ${interaction.member} is starting one soon!.` })
                    interaction.reply({ content: `${interaction.user} is now hosting a game! The user has been informed.` })
                    break
                default:
                    break
            }
        }
    })
}
