const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "gamepanel",
    description: "Send the game panel.",
    usage: `${process.env.PREFIX}gamepanel`,
    run: async (message, args, client) => {
        message.delete()
        let request = new MessageButton().setStyle("DANGER").setLabel("Request a Game").setCustomId("gp-request")
        let join = new MessageButton().setStyle("SUCCESS").setLabel("Join Game").setCustomId("igjoin")
        let spectate = new MessageButton().setStyle("PRIMARY").setLabel("Spectate").setCustomId("igspec")
        let host = new MessageButton().setStyle("SECONDARY").setLabel("Host").setCustomId("ighost")
        let row = new MessageActionRow().addComponents(request, join, spectate, host)
        let m = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(message.guild.name)
                    .setDescription(`_Hey players! Enjoying Wolvesville Simulation? Welcome to another game from the same narrators!_\n\n__**How to join or spectate the game?**__\n\n<:yes:907383308009230446> Click on the \`Request Game\` button below to request a game!\n<:yes:907383308009230446> If there is a game active, you can cick on the \`Join Game\` button below to join the game!\n<:yes:907383308009230446> If there is a game active and you want to spectate, use the \`Spectate\` button.\n\nEnjoy!`)
                    .setColor("ORANGE")
                    .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
            components: [row],
        })
        db.set(`entermsg`, m.id)
    },
}
