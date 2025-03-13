const installProc = require("../utils/installationProcess")

module.exports = async (interaction) => {
    if(interaction.customId == "install-process") installProc(interaction)
}