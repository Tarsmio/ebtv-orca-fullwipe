const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync, readSync, existsSync, } = require("fs")
const { EmbedBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const { randomFullwipeColor } = require('../../utils/utilityTools');
const { fetchMatchesOfTeam, fetchStages, fetchGroups } = require('../../utils/matchUtils');
const categoryList = readdirSync("./commands")

module.exports.execute = async (interaction) => {

    await interaction.deferReply()

    const valuePattern = /^.{3,40}_[0-9]{19}$/

    let team = interaction.options.getString("equipe")
    let jouer = interaction.options.getString("jouer")

    if (jouer != null) {
        switch (jouer) {
            case "oui":
                jouer = true
                break;

            case "non":
                jouer = false
                break;

            default:
                jouer = false
                break;
        }
    }

    if (!valuePattern.test(team)) {
        let find = false

        interaction.client.participants.forEach(el => {
            if (el.name.toLowerCase() == team.toLowerCase()) {
                team = `${el.name}_${el.id}`
                find = true
            }
        });

        if (!find) return await interaction.editReply(`L'équipe \`${team}\` n'existe pas !\n-# Pensez a bien verifier les caracatères speciaux`)
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

    let matches = await fetchMatchesOfTeam(teamId, jouer != null ? jouer : false)

    let repEmbed = new EmbedBuilder()
        .setTitle(`Planning de ${teamName}`)
        .setDescription(`Voici le planning des matchs a venir de ${teamName}`)
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
        repEmbed.setDescription("Cette équipe n'as plus aucun match a jouer !")
    } else {
        let fields = []
        let stages = await fetchStages()
        let groups = await fetchGroups()

        matches.forEach(m => {
            let opo

            let dateMatch = new Date(m.scheduled_datetime)

            m.opponents.forEach(op => {
                if (op.participant.name != teamName) opo = op.participant
            })

            let stageOfMatch = stages.find(({ id }) => id == m.stage_id)

            fields.push({
                name: `Contre ${opo.name} (${stageOfMatch.name == "Groupes" ? groups.find(({id}) => id == m.group_id).name : stageOfMatch.name})`,
                value: `Date : <t:${Math.floor(dateMatch / 1000)}:f>\nLieu : **${m.public_note}**`,
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
    name: "planning",
    description: 'Affiche le planning d\'une équipe',
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
            .setDescription("Nom de l'équipe a afficher le planning")
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addStringOption(option =>
        option.setName("jouer")
            .setDescription("Afficher les matchs déjà jouer ou non")
            .setRequired(false)
            .addChoices(
                { name: "Oui", value: "oui" },
                { name: "Non", value: "non" }
            )
    )