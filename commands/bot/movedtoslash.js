module.exports = {
    name: "movedtoslash",
    description: "Commands with aliases here have been moved to slash commands.",
    usage: `${process.env.PREFIX}movedtoslash`,
    aliases: ["srole"],
    run: async (message, args, client) => {
        return message.channel.send("This command has moved to slash commands!")
    },
}
