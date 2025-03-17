const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync, readSync, existsSync, } = require("fs")
const { EmbedBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const { randomFullwipeColor } = require('../../utils/utilityTools');
const { maps, modes } = require('../../data/maps-modes-data.json')
const { stages } = require('../../data/map-pool.json');
const emoteModeIndex = require('../../utils/emoteModeIndex');

function stagesToChoice() {
    let toReturn = []

    stages.forEach(s => {
        toReturn.push({
            name: s.name,
            value: s.id.toString()
        })
    })

    return toReturn
}

module.exports.execute = async (interaction) => {

    await interaction.deferReply()

    let fields = []

    const phase = parseInt(interaction.options.getString("phase"))

    let stageInfo = stages.find(({ id }) => id == phase)

    let color = randomFullwipeColor()

    let thumbPathNumber

    switch (color) {
        case "#2918e0":
            thumbPathNumber = 1
            break;

        case "#ec7a19":
            thumbPathNumber = 2
            break;

        case "#57db0f":
            thumbPathNumber = 3
            break;

        default:
            thumbPathNumber = 0
            break;
    }

    let repEmbed = new EmbedBuilder()
        .setTitle(`Maps ${stageInfo.name}`)
        .setColor(color)
        .setThumbnail("attachment://icon-maps.png")
        .setFooter({
            text: "Fullwipe 2025",
            iconURL: interaction.client.user.avatarURL({
                extension: "png",
                size: 64
            })
        })

    stageInfo.rounds.forEach(r => {
        let mapStringBuild = []

        r.set.forEach(m => {
            mapStringBuild.push(`- ${emoteModeIndex[m.mode]} - ${maps.find(({ id }) => id == m.map).name}`)
        })

        fields.push({
            name: `${stageInfo.name} - ${r.name}`,
            value: mapStringBuild.join("\n")
        })
    })

    repEmbed.addFields(fields)



    await interaction.editReply({
        embeds: [repEmbed],
        files: [{
            name: "icon-maps.png",
            attachment: `./images/icon-maps_${thumbPathNumber.toString()}.png`
        }]
    })
}

module.exports.info = {
    name: "maps",
    description: 'Affiche les maps d\'une phase demander',
    rolePermission: [],
    userPersmission: [],
    helpReportType: 0,
    category: "fullwipe",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addStringOption(option =>
        option.setName("phase")
            .setDescription("La phases du tournoi a afficher les maps")
            .addChoices(stagesToChoice())
            .setRequired(true)
    )