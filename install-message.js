require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.login(process.env.DISCORD_TOKEN);

client.on('ready', async bot => {
    
    let installEmbed = new EmbedBuilder()
        .setTitle("O.R.C.A Fullwipe")
        .setDescription("O.R.C.A Fullwipe est un bot qui vous facilitera la tâche pour Fullwipe.\n\nO.R.C.A Fullwipe est un bot à utiliser en message privé. Cliquez sur le bouton en dessous pour commencer. \n\nVérifiez que vous autorisez les messages des membres venant de ce serveur !")
        .setColor("#dc1c53")
        .setThumbnail(bot.user.displayAvatarURL({
            extension: "png",
            size: 64
        }))
        .setFooter({
            text: "Fullwipe 2025",
            iconURL: bot.user.displayAvatarURL({
                extension: "png",
                size: 64
            })
        })

    let startButton = new ButtonBuilder()
        .setLabel("Utiliser O.R.C.A Fullwipe")
        .setCustomId("install-process")
        .setStyle(ButtonStyle.Success)

    let row = new ActionRowBuilder()
        .addComponents(startButton)

    let channelToSend = await bot.channels.fetch(process.env.INSTALL_CHANNEL)

    await channelToSend.send({
        embeds:[installEmbed],
        components: [row]
    })
})