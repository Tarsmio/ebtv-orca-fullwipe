require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');
const { ToornamentTokenGest } = require('./utils/ToornamenTokenGest');
const { getParticipants } = require('./utils/toornamentUtils');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
client.participants = []
client.args = process.argv.slice(2)
client.toornamentToken = ToornamentTokenGest.getInstance()

loadCommands(client)
loadEvents(client)

client.login(process.env.DISCORD_TOKEN);