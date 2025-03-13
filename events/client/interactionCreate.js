const { commandHandle, autocompHandle, compoHandle } = require("../../handler")

module.exports = async (interaction) => {
    if(interaction.isCommand()) commandHandle(interaction)
    if (interaction.isAutocomplete()) autocompHandle(interaction)
    if(interaction.isMessageComponent()) compoHandle(interaction)
}