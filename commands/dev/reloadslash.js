const { ids } = require("../../config")

module.exports = {
    name: "reloadslash",
    description: "Loads slash commands, add them if they don't exist yet and overrides the permissions.",
    usage: `${process.env.PREFIX}reloadslash`,
    run: (message, args, client) => {
        if (!message.member.roles.cache.has("907357190753497139")) return message.reply({ content: "You are missing permissions to do that!" })
        let done = 0
        client.slashCommands.each((cmd) => {
            client.application.commands.create(cmd.command, message.guild.id).then((command) => {
                if (cmd.permissions) command.permissions.set({ command: command, permissions: cmd.permissions })
            })
            done += 1
        })
        message.channel.send({ content: `${done} slash commands created/updated.` })
    },
}
