const fs = require('node:fs');
const { readyLog } = require('../../utils/logs');
const { loadCommandIds } = require('../../utils/loaders');
const { url } = require('node:inspector');
const { deploySlashCommands, deployPrivateSlashCommands } = require('../../utils/slashDeployer');
const { getParticipants } = require('../../utils/toornamentUtils');

module.exports = async (client) => {
    try{

        /*if(client.args[0] != "dev"){
            const newAvatar = fs.readFileSync('./images/Orca.png');
            await client.user.setAvatar(newAvatar);
        }*/

        /*await client.channels.cache.get("743460063917637682").send({
            content: "Oui",
            reply: { 
                messageReference: '1314175372706840646'
            }
        })*/

        /*const newBanner = fs.readFileSync('./images/banner.png');
        await client.user.setBanner(newBanner)*/

        await client.user.setPresence({
            activities : [
                {
                    name: "Fullwipe 2025",
                    state: "/help",
                    type: 5,
                    url: "https://www.youtube.com/@eSportBrosTV"
                }
            ]
        })

    } catch (error){
        console.error('Error updating bot name and avatar:', error);
    }

    await deploySlashCommands(client)
    await deployPrivateSlashCommands(client)

    client.commandIds = await loadCommandIds(client)

    let participants = await getParticipants(0,49)

    client.participants = participants.data

    let test = client.participants.map(({name}) => name)

    console.log(`Ready! Logged in as ${client.user.tag}`);

    readyLog(client)
}