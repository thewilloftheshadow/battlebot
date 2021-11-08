const Discord = require("discord.js")
const config = require("../config")
const db = require("quick.db")
const { Util } = require("discord.js")
const cooldowns = new Discord.Collection()
const prefix = process.env.PREFIX

module.exports = (client) => {
    //When receiving a message
    client.on("messageCreate", async (message) => {
        let maint = db.get("maintenance")

        //let guy = message.member.nickname;
        if (message.author.bot) return //Ignore bots and dms
        if (message.content === `<@!${client.user.id}>`) return message.author.send(`Hey! My prefix is ${prefix}, you can ask for \`${prefix}help\` if you ever need.`)

        if (!message.content.startsWith(prefix)) return
        if (maint && !client.botAdmin(message.author.id)) return message.channel.send("Sorry! The bot is currently in maintenance mode!")

        const args = message.content.slice(prefix.length).split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command =
            client.commands.get(commandName) || //DO NOT PUT ;
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) return //If such command doesn't exist, ignore it

        //Ignore guild-only commands inside DMs
        if (command.guildOnly && message.channel.type !== "text") {
            return message.reply("I can't execute that command in DMs!")
        }
        //Check if that command needs arguments

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
            }
            return message.channel.send(reply)
        }

        //Check if command is in cooldown
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }
        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 0) * 1000
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return message.reply(`please wait ${Math.ceil(timeLeft.toFixed(1))} more seconds before reusing the \`${command.name}\` command.`)
            }
        }
        timestamps.set(message.author.id, now)
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

        // //Execute command if everything is ok
        // try {
        //     command.run(message, args, client)
        // } catch (error) {
        //     console.error(error)
        //     message.reply("Something went wrong...")
        // }

        client.channels.cache.get("907359846381281310").send(Discord.Util.removeMentions(`Command ran: **${commandName}**\nArguments: **${args.join(" ") || "None"}**\nAuthor: ${message.author.tag} (${message.author.id})`))
        await command.run(message, args, client)?.catch((error) => {
            console.error(error)
            message.channel.send(Util.splitMessage(error, { maxLength: 2000, char: "\n" }))
            message.channel.send("An error has occurred.")
        })
    })
}
