const ms = require("ms")

module.exports = {
    name: "timer",
    descriprion: "",
    usage: `${process.env.PREFIX}timer <time...>`,
    run: async (message, args, client) => {
        if (args.length < 1) return message.channel.send("Please specify a duration")
        let timer = ms(args.join(" ").toString())
        if (!timer) return message.channel.send("Invalid time")
        message.channel.send(`Your timer has been set to ${ms(timer)}`)

        setTimeout(function () {
            message.channel.send(`${message.author}, time is up`)
        }, timer) //.catch(e => message.channel.send(`Error: ${e.message}`))
    },
}
