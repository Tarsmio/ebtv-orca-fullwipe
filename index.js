require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');
const { ToornamentTokenGest } = require('./utils/ToornamenTokenGest');
const { getParticipants } = require('./utils/toornamentUtils');
const { fetchStages, fetchGroups } = require('./utils/matchUtils');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

async function launch() {

    client.commands = new Collection();
    client.participants = []
    client.args = process.argv.slice(2)
    client.toornamentToken = ToornamentTokenGest.getInstance()
    client.stagesAtLaunch = await fetchStages()
    client.groupsAtLaunch = await fetchGroups()

    loadCommands(client)
    loadEvents(client)

    client.login(process.env.DISCORD_TOKEN);
}

launch()

module.exports = {
    client
}