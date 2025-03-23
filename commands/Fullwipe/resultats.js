const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync, readSync, existsSync, } = require("fs")
const { EmbedBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const { randomFullwipeColor } = require('../../utils/utilityTools');
const { fetchMatchesOfTeam, fetchMatchesPlayedOfTeam, fetchStages, fetchGroups } = require('../../utils/matchUtils');
const categoryList = readdirSync("./commands")

const scoreEmoteRoundIndex = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟"
]

module.exports.execute = async (interaction) => {

    await interaction.deferReply()

    const valuePattern = /^.{3,40}_[0-9]{19}$/

    let team = interaction.options.getString("equipe")

    if (!valuePattern.test(team)) {
        let find = false

        interaction.client.participants.forEach(el => {
            if (el.name.toLowerCase() == team.toLowerCase()) {
                team = `${el.name}_${el.id}`
                find = true
            }
        });

        if (!find) return await interaction.editReply(`L'équipe \`${team}\` n'existe pas !\n-# Pensez à bien vérifier les caractères spéciaux.`)
    }

    let teamName = team.split("_")[0]
    let teamId = team.split("_")[1]

    let teamToornament = null

    interaction.client.participants.forEach(el => {
        if (el.id == teamId) teamToornament = el
    })

    let logo = "./logo/Alpha.png"

    if (existsSync(`./logo/${teamToornament.name}.png`)) {
        logo = `./logo/${teamToornament.name}.png`
    }

    let matches = await fetchMatchesPlayedOfTeam(teamId)

    let repEmbed = new EmbedBuilder()
        .setTitle(`Résultats de ${teamName}`)
        .setDescription(`Voici les résultats de ${teamName}`)
        .setColor(randomFullwipeColor())
        .setThumbnail("attachment://logo.png")
        .setFooter({
            text: "Fullwipe 2025",
            iconURL: interaction.client.user.avatarURL({
                extension: "png",
                size: 64
            })
        })

    if (matches.length <= 0) {
        repEmbed.setDescription("Cette équipe n'a aucun résultat !")
    } else {
        let fields = []
        let stages = await fetchStages()
        let groups = await fetchGroups()
        let stagesOfTeam = []


        await matches.forEach(m => {
            let stageInList = stagesOfTeam.find(({stage_infos}) => stage_infos.id == m.stage_id)

            let opoResult
            let teamResult

            m.opponents.forEach(op => {
                if (op.participant.name != teamName){
                    opoResult = op
                } else {
                    teamResult = op
                }
            })

            if (!stageInList){
                let sta = stages.find(({id}) => id == m.stage_id)

                stagesOfTeam.push({
                    stage_infos: {
                        id: sta.id,
                        name: sta.name,
                        group_name: sta.name == "Groupes" ? groups.find(({id}) => id == m.group_id).name : null
                    },
                    matches: [`${teamResult.result == "win" ? `🟢 **${teamName}** ${scoreEmoteRoundIndex[teamResult.score]} - ${scoreEmoteRoundIndex[opoResult.score]} ${opoResult.participant.name}` : `🔴 ${teamName} ${scoreEmoteRoundIndex[teamResult.score]} - ${scoreEmoteRoundIndex[opoResult.score]} **${opoResult.participant.name}**`}`]
                })
            } else {
                stageInList.matches.push(`${teamResult.result == "win" ? `🟢 **${teamName}** ${scoreEmoteRoundIndex[teamResult.score]} - ${scoreEmoteRoundIndex[opoResult.score]} ${opoResult.participant.name}` : `🔴 ${teamName} ${scoreEmoteRoundIndex[teamResult.score]} - ${scoreEmoteRoundIndex[opoResult.score]} **${opoResult.participant.name}**`}`)
            }
        })

        stagesOfTeam.forEach(st => {
            fields.push({
                name: `Phase : ${st.stage_infos.name} ${st.stage_infos.group_name != null ? `(${st.stage_infos.group_name})` : ''}`,
                value: st.matches.join("\n"),
            })
        })

        repEmbed.addFields(fields)
    }

    interaction.editReply({
        //content: `test autocompletion ${team}\nNom : ${teamName}, Id : ${teamId}\nToornament : ${JSON.stringify(teamToornament)}\nTest logo : ${teamToornament.custom_fields.logo}`,
        embeds: [repEmbed],
        files: [{
            name: "logo.png",
            attachment: logo
        }]
    })

}

module.exports.autocom = async (interaction) => {
    const option = interaction.options.getFocused(true);

    if (option.name === 'equipe') {
        const teamListe = interaction.client.participants.map(({ name, id }) => ({
            name: name,
            id: id
        }))

        let filterElement = teamListe.filter(el => el.name.toLowerCase().startsWith(option.value.toLowerCase()))

        if (filterElement.length >= 25) {
            filterElement = filterElement.slice(0, 24)
        }

        await interaction.respond(
            filterElement.map(el => ({ name: el.name, value: `${el.name}_${el.id}` }))
        )
    }
}

module.exports.info = {
    name: "resultats",
    description: 'Affiche les résultats d\'une équipe',
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
        option.setName("equipe")
            .setDescription("Nom de l'équipe à afficher les résultats")
            .setRequired(true)
            .setAutocomplete(true)
    )