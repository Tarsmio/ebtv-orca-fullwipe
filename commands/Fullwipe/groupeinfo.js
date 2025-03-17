const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync, readSync, existsSync, } = require("fs")
const { EmbedBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const { randomFullwipeColor } = require('../../utils/utilityTools');
const emoteModeIndex = require('../../utils/emoteModeIndex');
const { fetchStages, fetchUniqueGroup, fetchRankingOfGroup } = require('../../utils/matchUtils');
const { client } = require('../..');

const rankEmoteIndex = [
    `<:ar:${process.env.RANK_AR_EMOTE}>`,
    `<:rank_1:${process.env.RANK_UN_EMOTE}>`,
    `<:rank_2:${process.env.RANK_DEUX_EMOTE}>`,
    `<:rank_3:${process.env.RANK_TROIS_EMOTE}>`,
    `<:rank_4:${process.env.RANK_QUATRE_EMOTE}>`,
    `<:rank_5:${process.env.RANK_CINQ_EMOTE}>`
]

const winEmoteIndex = [
    `<:v_0:${process.env.WIN_ZERO}>`,
    `<:v_1:${process.env.WIN_UN}>`,
    `<:v_2:${process.env.WIN_DEUX}>`,
    `<:v_3:${process.env.WIN_TROIS}>`,
    `<:v_4:${process.env.WIN_QUATRE}>`
]

const looseEmoteIndex = [
    `<:l_0:${process.env.LOOSE_ZERO}>`,
    `<:l_1:${process.env.LOOSE_UN}>`,
    `<:l_2:${process.env.LOOSE_DEUX}>`,
    `<:l_3:${process.env.LOOSE_TROIS}>`,
    `<:l_4:${process.env.LOOSE_QUATRE}>`
]

function stagesToChoice() {
    let toReturn = []


    let stages = client.stagesAtLaunch
    let groups = client.groupsAtLaunch

    let stageOfPoule = stages.find(({ name }) => name == "Groupes")

    let groupsOfPoule = groups.filter(({ stage_id }) => stage_id == stageOfPoule.id)

    groupsOfPoule.forEach(gr => {
        toReturn.push({
            name: gr.name,
            value: gr.id
        })
    });

    return toReturn
}

module.exports.execute = async (interaction) => {
    await interaction.deferReply()

    const groupId = interaction.options.getString("groupe")

    const groupe = await fetchUniqueGroup(groupId)
    const ranking = await fetchRankingOfGroup(groupId)

    let participantsNamesOfGroupe = []

    ranking.forEach(r => {
        if (r.participant == null) {
            participantsNamesOfGroupe.push("A determiné")
        } else {
            participantsNamesOfGroupe.push(r.participant.name)
        }
    })

    let fields = []

    let repEmbed = new EmbedBuilder()
        .setTitle(groupe.name)
        .setDescription(`Voici toutes les infos du groupe \"${groupe.name}\"`)
        .setColor(randomFullwipeColor())

    if (ranking.lenght <= 0) {
        fields.push({
            name: "Equipes du groupe",
            value: "Ce groupe n'as aucune équipe"
        })

        fields.push({
            name: "Classement",
            value: "Ce groupe n'as pas de classement"
        })
    } else {
        let teamEmbed = []
        let rankEmbed = []

        participantsNamesOfGroupe.forEach(p => {
            teamEmbed.push(`- ${p}`)
        })

        fields.push({
            name: "Equipes du groupe",
            value: teamEmbed.join("\n")
        })

        ranking.forEach(r => {
            rankEmbed.push(`${rankEmoteIndex[r.rank == null ? 0 : r.rank]} - **${r.participant == null ? "A determiné" : r.participant.name}** - ${winEmoteIndex[r.properties.wins]}**/**${looseEmoteIndex[r.properties.losses]} - **${r.points == null ? "0" : r.points} Pts**`)
        })

        fields.push({
            name: "Classement",
            value: rankEmbed.join("\n")
        })
    }

    repEmbed.addFields(fields)

    await interaction.editReply({ embeds: [repEmbed] })
}

module.exports.info = {
    name: "groupeinfo",
    description: 'Affiche les information d\'un groupe',
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
        option.setName("groupe")
            .setDescription("Le groupe a afficher les infos")
            .addChoices(stagesToChoice())
            .setRequired(true)
    )