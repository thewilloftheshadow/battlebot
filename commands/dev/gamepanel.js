const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "gamepanel",
    description: "Send the game panel.",
    usage: `${process.env.PREFIX}gamepanel`,
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id)) return

        let button2 = new MessageButton().setStyle("SUCCESS").setLabel("Request a Full Game").setCustomId("gp-request")
        let row = new MessageActionRow().addComponents(button1, button2, button3)
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(message.guild.name)
                    .setDescription("Welcome to BattleBot! Select an option below!")
                    .setColor("ORANGE")
                    .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
            components: [row],
        })
    },
}
