const shuffle = require("shuffle-array")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, fn, ids, messages } = require("../../config")

module.exports = {
    command: {
        name: "startgame",
        description: "Set the gamemode and settings for the game!",
        options: [
            {
                type: "STRING",
                name: "gamemode",
                description: "Select the gamemode for this game.",
                required: true,
                choices: [
                    { name: "Chess", value: "chess" },
                    { name: "Pokemon", value: "pokemon" },
                    { name: "Custom", value: "custom" },
                ],
            },
            {
                type: "STRING",
                name: "channels",
                description: "List the channel names to be randomized among the players.",
                required: false,
            },
        ],
        defaultPermission: false,
    },
    permissions: [
        { id: ids.host, type: "ROLE", permission: true }, // @Narrator
        { id: ids.server, type: "ROLE", permission: false }, // @Player
    ],
    run: async (interaction, client) => {
        let gamemode = interaction.options.getString("gamemode")
        let channels = interaction.options.getString("channels")

        let player = interaction.guild.roles.cache.find((r) => r.name === "Player")
        let host = interaction.guild.roles.cache.find((r) => r.name === "Host")
        let channelNames = [],
            roleOptions = [],
            allChannels = []

        await interaction.deferReply()

        let enterGame = interaction.guild.channels.cache.find((c) => c.name === "enter-game")
        let gameChat = interaction.guild.channels.cache.find((c) => c.name === "game-chat")
        let gameLobby = interaction.guild.channels.cache.find((c) => c.name === "game-lobby")

        let usedChannels = []
        db.set(`usedChannels`, usedChannels)

        channelNames = channels?.split(" ") || []
        channelNames.forEach((arg) => {
            channelNames[channelNames.indexOf(arg)] = arg.toLowerCase()
        })
        if (channelNames?.length != player.members.size && gamemode == "custom") {
            return interaction.editReply("The number of channels does not match the number of players!")
        }

        if (channelNames.length < 1) channelNames = player.members.map((m) => m.user.username.toLowerCase())

        console.log(channelNames)

        // create channel for each player
        for (let i = 0; i < player.members.size; i++) {
            let name = channelNames[i]
            let channel = await interaction.guild.channels.create(name, {
                type: "text",
                parent: "907682188554821682",
                permissionOverwrites: [
                    {
                        id: host.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                        id: player.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                ],
            })
            allChannels.push(channel)
            usedChannels.push(channel.id)
            db.set(`usedChannels`, usedChannels)
        }

        messages[gamemode].forEach((m) => {
            let dcSent = await gameChat.send(m)
            dcSent.pin()
            console.log(m)
        })
        gameChat.permissionOverwrites.edit(ids.player, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        })
        client.commands.get("playerinfo").run(interaction, [], client)

        client.commands.get("disable").run(interaction, ["join"], client)

        // changing perms for alive in game-lobby
        gameLobby.send("Game starting in 5 ...")

        setTimeout(async () => {
            gameLobby.send("4")
        }, 1000)
        setTimeout(async () => {
            gameLobby.send("3")
        }, 2000)
        setTimeout(async () => {
            gameLobby.send("2")
        }, 3000)
        setTimeout(async () => {
            gameLobby.send("1")
        }, 4000)
        setTimeout(async () => {
            gameLobby.permissionOverwrites.edit(ids.player, {
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false,
                VIEW_CHANNEL: false,
            })
        }, 5000)

        gameChat.permissionOverwrites.edit(ids.player, {
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: true,
            VIEW_CHANNEL: true,
        })

        interaction.editReply("The game has started! Use +unlock and +lock to control the game chat.")
        await enterGame.send("Game is starting. You can no longer join. Feel free to spectate!")
        interaction.guild.channels.cache.find((x) => x.name == "enter-game").send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)
        db.set("started", "yes")
    },
}
