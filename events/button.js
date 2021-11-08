const { MessageActionRow, MessageButton } = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const { ids } = require("../config")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customId)
        if (interaction.customId == "igjoin") {
            //if (db.get("started") == "yes") return interaction.reply(`The game has already started!`, { ephemeral: true })
            let guy = interaction.member
            if (guy.roles.cache.has(ids.spectator)) guy.roles.remove(ids.spectator) //spec
            if (guy.roles.cache.has(ids.host)) guy.roles.remove(ids.host)
            if (guy.roles.cache.has(ids.hostteam)) guy.roles.remove(ids.mini)
            let role = interaction.guild.roles.cache.get(ids.alive)
            await guy.roles
                .add(ids.alive)
                .then((g) => g.setNickname(role.members.size.toString()).catch((e) => interaction.reply(`Error: ${e.message}`)))
                .catch((e) => interaction.reply(`Error: ${e.message}`))
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} joined the game!`)
            interaction.deferUpdate()
        }
        if (interaction.customId == "igspec") {
            let guy = interaction.member
            if (guy.roles.cache.has(ids.dead)) return interaction.reply({ content: `Sorry, you're dead! You can't spectate after you've already played!`, ephemeral: true })
            if (!guy.roles.cache.has(ids.immunity)) {
                guy.setNickname("lazy spectatorz")
            } else {
                guy.setNickname(guy.user.username)
            }
            guy.roles.add(ids.spectator)
            if (guy.roles.cache.has(ids.alive)) guy.roles.remove(ids.alive) //alive
            if (guy.roles.cache.has(ids.narrator)) guy.roles.remove(ids.narrator) //narr
            if (guy.roles.cache.has(ids.mini)) guy.roles.remove(ids.mini) //mininarr
            interaction.deferUpdate()
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} is now spectating the game!`)
        }
        if (interaction.customId == "ashish-ignarr") {
            let member = await interaction.guild.members.fetch({ user: interaction.member.id, force: true }).catch((e) => e)
            if (!member?.roles.cache.has(ids.hostteam)) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            if (member.roles.cache.has(ids.hostteam)) {
                interaction.member.roles.add(ids.host)
            }
            interaction.deferUpdate()
        }

        if (interaction.customId.startsWith("shoppage")) {
            let page = parseInt(interaction.customId.split("-")[1])
            interaction.update({
                embeds: [shop.embeds[page - 1]],
            })
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
                    interaction.reply({ content: "Your request has been sent to the narrators!", ephemeral: true })
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
