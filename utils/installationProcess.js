const { EmbedBuilder } = require("discord.js")

function sendError(interaction) {
    interaction.reply({
        content: "Je ne peut pas t'envoyer de message priver merci d'autoriser les messages de membre provenant de ce serveur",
        ephemeral: true
    }).then(r => {
        setTimeout(() => interaction.deleteReply(), 15000)
    })
}

module.exports = async (interaction) => {
    let user = interaction.user

    let channelToSend = user.dmChannel

    if (channelToSend == null) {
        channelToSend = await user.createDM()
    }

    let welcomeEmbed = new EmbedBuilder()
        .setTitle("O.R.C.A Fullwipe")
        .setDescription("Merci d'utiliser O.R.C.A Fullwip ! Voici un petit guide d'utilisation !")
        .setColor("#dc1c53")
        .addFields([
            {
                name: "Étape 1",
                value: "Pour voir la liste des commandes, il suffit de cliquer sur le bouton bleu nommé \"Commandes\" juste en bas à la place de l'endroit pour ecrire un message.\n\nSi jamais ce bouton n'est pas présent, clique sur la flèche bleu tout à gauche de la barre de message !"
            },
            {
                name: "Étape 2",
                value: "Maintenant tu es devant la liste des commandes. Choisis en une et suis les instructions pour l'exécuter !"
            },
            {
                name: "Étape bonus",
                value: "Tu peux utiliser la commande help pour avoir plus d'info sur chacune des commandes !"
            }
        ])
        .setThumbnail(interaction.client.user.displayAvatarURL({
            extension: "png",
            size: 64
        }))
        .setFooter({
            text: "Fullwipe 2025",
            iconURL: interaction.client.user.displayAvatarURL({
                extension: "png",
                size: 64
            })
        })

    try {
        channelToSend.send({ embeds: [welcomeEmbed] }).then(m => {
            interaction.reply({
                content: "Tu viens de recevoir le guide d'utilisation par MP !",
                ephemeral: true
            }).then(r => {
                setTimeout(() => interaction.deleteReply(), 10000)
            })
        })

    } catch (error) {
        sendError(interaction)
    }


}