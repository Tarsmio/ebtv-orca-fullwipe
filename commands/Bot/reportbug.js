const { SlashCommandBuilder, ButtonBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync, readSync, existsSync, } = require("fs")
const { EmbedBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const { randomFullwipeColor } = require('../../utils/utilityTools');
const { fetchMatchesOfTeam } = require('../../utils/matchUtils');
const categoryList = readdirSync("./commands")

module.exports.execute = async (interaction) => {

    await interaction.deferReply()

    let bug = interaction.options.getString("bug")

    let bugReport = new EmbedBuilder()
        .setTitle("Bug signalé !")
        .setDescription(bug)
        .setColor("#ff0000")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
            text: interaction.user.username
        })

    let repButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${interaction.user.id}`)
        .setLabel("Répondre")

    let row = new ActionRowBuilder()
        .addComponents(repButton)

    await interaction.client.channels.cache.get(process.env.BUG_CHANNEL).send({
        content: "<@1251579892534083668>",
        embeds: [bugReport],
        components: [row]
    })

    await interaction.editReply("Merci de votre signalement ! N'hesitez pas à aller voir Tarsmio directement si le problème est vraiment urgent.")

}

module.exports.info = {
    name: "reportbug",
    description: 'Permet de signaler un bug',
    rolePermission: [],
    userPersmission: [],
    helpReportType: 0,
    category: "bot",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addStringOption(option =>
        option.setName("bug")
            .setDescription("Décrire en 6000 caractères maximum le bug")
            .setRequired(true)
    )