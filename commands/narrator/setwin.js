const db = require("quick.db")
module.exports = {
    name: "setwin",
    description: "End the game and announce the winner.",
    usage: `${process.env.PREFIX}setwin <winner...>`,
    hostOnly: true,
    run: async (message, args, client) => {
        db.set(`winner`, args.join(" "))
        message.channel.send("Done!")
        db.set(`gamePhase`, -10)
        db.set(`commandEnabled`, "yes")
        message.guild.channels.cache.find((x) => x.name == "game-chat").send(`Game over! ${args.join(" ")} has won!`)
        message.guild.channels.cache.find((x) => x.name == "enter-game").send(`Game ended! ${db.get(`winner`)} won the match!`)
    },
}
