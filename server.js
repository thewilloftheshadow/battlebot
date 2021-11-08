console.log("Booting bot...")
require("dotenv").config()

const fs = require("fs")
const db = require("quick.db")

if (db.get("emergencystop")) {
    console.log("Bot has been emergency stopped")
    process.exit(0)
}

const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES"] })
const config = require("./config")
client.db = db

if (process.env.DEBUG) {
    client.on("debug", console.debug)
    client.on("messageCreate", (x) => console.debug(`${x.content} - ${x.author.tag} ${x.author.id}`))
}

client.commands = new Discord.Collection()
fs.readdir("./commands/", (err, files) => {
    files.forEach((file) => {
        let path = `./commands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find commands in the ${file} category.`)
                return
            }
            jsfile.forEach((f, i) => {
                let props = require(`./commands/${file}/${f}`)
                props.category = file
                try {
                    client.commands.set(props.name, props)
                    if (props.aliases) props.aliases.forEach((alias) => client.commands.set(alias, props))
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})
client.slashCommands = new Discord.Collection()
fs.readdir("./slashCommands/", (err, files) => {
    files.forEach((file) => {
        let path = `./slashCommands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find slash commands in the ${file} category.`)
            }
            jsfile.forEach((f, i) => {
                let props = require(`./slashCommands/${file}/${f}`)
                props.category = file
                try {
                    client.slashCommands.set(props.command.name, props)
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
    require(`./events/${file}`)(client)
}

client.botAdmin = (id) => {
    if (["439223656200273932"].includes(id)) return true
    return false
}

//Bot on startup
client.on("ready", async () => {
    client.config = {}
    let commit = require("child_process").execSync("git rev-parse --short HEAD").toString().trim()
    let branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
    client.user.setActivity(client.user.username.toLowerCase().includes("beta") ? "testes gae on branch " + branch + " and commit " + commit : "BattleBot!")
    console.log("Connected!")
    client.userEmojis = client.emojis.cache.filter((x) => config.ids.emojis.includes(x.guild.id))
    client.channels.cache.get("907359846381281310").send(`Bot has started, running commit \`${commit}\` on branch \`${branch}\``)
    //Invite Tracker
    client.allInvites = await client.guilds.cache.get(config.ids.server.sim).invites.fetch()
})

let maint = db.get("maintenance")
if (typeof maint == "string" && maint.startsWith("config-")) {
    client.channels.cache.get(maint.split("-")[1])?.send("Config has successfully been reloaded!")
    db.set("maintenance", false)
}

client.login(process.env.TOKEN)

client.on("error", (e) => console.error)

module.exports = { client }
