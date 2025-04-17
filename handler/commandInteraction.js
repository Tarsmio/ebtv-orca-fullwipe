const { EmbedBuilder } = require("discord.js");
const { commandLog } = require("../utils/logs");
const { randomFullwipeColor } = require("../utils/utilityTools");

module.exports = async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if (command.info.rolePermission.length > 0) {
        const member = interaction.member

        if (!command.info.rolePermission.some(roleId => member.roles.cache.has(roleId))) return interaction.reply({
            ephemeral: true,
            content: "Désolé tu n'as pas le droit d'utiliser cette commande !"
        })
    }

    try {
        await command.execute(interaction);

        let endEmbed = new EmbedBuilder()
            .setTitle("C'est fini ! :cry:")
            .setDescription("Fullwipe 2025 c'est terminé ! Le bot seras bientôt hors ligne... Merci de l'avoir utiliser")
            .setImage("attachment://end.jpg")
            .setColor(randomFullwipeColor())
            .setFooter({
                text: "Fullwipe 2025",
                iconURL: interaction.client.user.avatarURL({
                    extension: "png",
                    size: 64
                })
            })

        await interaction.channel.send({
            embeds: [endEmbed],
            files: [{
                name: "end.jpg",
                attachment: `./images/endImage.jpg`
            }]
        })
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    commandLog(interaction)
}