const db = require("quick.db")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        if (interaction.customId.startsWith("poll")) {
            await interaction.deferUpdate()
            let voted = db.get(`poll${interaction.message.id}id_${interaction.member.id}`)
            if (voted) {
                let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                if (tmestodel) {
                    await tmestodel.delete()
                }
            }
            let omg = await interaction.message.channel.send(`${interaction.member.displayName} voted ${interaction.values[0]}`)
            db.set(`poll${interaction.message.id}_${interaction.member.id}`, interaction.values[0])
            db.set(`poll${interaction.message.id}id_${interaction.member.id}`, omg.id)
        }
    })
}
