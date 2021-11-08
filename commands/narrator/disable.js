const db = require("quick.db")
const { MessageActionRow } = require("discord.js")

module.exports = {
    name: "disable",
    hostOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        if (!args[0]) return message.channel.send(`Please specify the button to disable (join/spec/request)`)
        if (args[0] == "join") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let reqbutton = row.components[0]
                    let jgbutton = row.components[1]
                    let specbutton = row.components[2]
                    let narrbutton = row.components[3]
                    jgbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(reqbutton, jgbutton, specbutton, narrbutton)] })
                })
        } else if (args[0] == "spec") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let reqbutton = row.components[0]
                    let jgbutton = row.components[1]
                    let specbutton = row.components[2]
                    let narrbutton = row.components[3]
                    specbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(reqbutton, jgbutton, specbutton, narrbutton)] })
                })
        } else if (args[0] == "request") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let reqbutton = row.components[0]
                    let jgbutton = row.components[1]
                    let specbutton = row.components[2]
                    let narrbutton = row.components[3]
                    reqbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(reqbutton, jgbutton, specbutton, narrbutton)] })
                })
        } else return message.channel.send(`I could not find the button.`)
    },
}
