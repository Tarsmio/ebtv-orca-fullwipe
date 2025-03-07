const { EmbedBuilder, Options, CommandInteraction } = require("discord.js")

module.exports = (cmdInteraction) => {
    const command = cmdInteraction.client.commands.get(cmdInteraction.commandName)
    const user = cmdInteraction.inGuild() ? cmdInteraction.member : cmdInteraction.user
    const commandJSON = command.dataSlash.toJSON()

    const logEmbed = new EmbedBuilder()
        .setTitle("Log O.R.C.A")
        .setDescription(`La commande </${cmdInteraction.commandName}:${cmdInteraction.commandId}> vient d'etre effectuer`)
        .setColor("#1882f9")
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .addFields(
            {
                name: 'Surnom utilisateur',
                value: cmdInteraction.inGuild() ? (user.nickname !== null ? `${user.nickname}` : "Pas de surnom sur le serveur.") : user.username,
                inline: true
            },
            {
                name: "Utilisateur",
                value: cmdInteraction.user.tag,
                inline: true
            },
            {
                name: "Salon",
                value: `<#${cmdInteraction.channelId}>`,
                inline: true
            }
        )

    if (commandJSON.options.length > 0) {
        var optionListe = []

        commandJSON.options.forEach(opt => {
            optionListe.push(opt.name)
        })

        var optString = []

        optionListe.forEach(opt => {
            optInteraction = cmdInteraction.options.get(opt)

            if(!optInteraction) return
            
            type = optInteraction.type
            let formatedValue = optInteraction.value

            switch (type) {
                case 8 : 
                    formatedValue = `<@&${optInteraction.value}>`
                    break
                
                case 6 :
                    formatedValue = `<@${optInteraction.value}>`
                    break
            }

            if (optInteraction) {
                optString.push(`- \`${optInteraction.name}\` : ${formatedValue}`)
            }
        })

        if (optString.length != 0) {
            logEmbed.addFields({
                name: "Options",
                value: optString.join("\n")
            })
        }
    }

    cmdInteraction.client.channels.cache.get(process.env.CHANNEL_ID_LOG_BOT).send({ embeds: [logEmbed] })
}
