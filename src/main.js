require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

// Import all handlers and modules
const interactionsHandler = require("../Modules/Interactionhandler.js");
const registerCommands = require("../OneTimeRuns/RegisterSlashCommands.js");
const setupCodeOfConduct = require("../OneTimeRuns/CodeofConductMessage.js");
const welcome = require("../Modules/Welcome.js");
const addbanwords = require("./commands/addbanWord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
});

// Make the ready event handler async
client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
  
  // Set up Code of Conduct
  try {
    await setupCodeOfConduct(client);
    console.log('Code of Conduct setup completed');
  } catch (error) {
    console.error('Error setting up Code of Conduct:', error);
  }

  // Initialize welcome system
  welcome(client);
});

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  try {
    // Handle button clicks for Code of Conduct acceptance
    if (interaction.isButton() && interaction.customId === 'accept_coc') {
      await interaction.reply({
        content: 'Thank you for accepting the Code of Conduct! Welcome to IT Meet 2024.',
        ephemeral: true
      });
      return;
    }

    // Handle other interactions
    await interactionsHandler(interaction);
  } catch (error) {
    console.error(error);
  }
});

// Handle messages for banned words
client.on('messageCreate', async (message) => {
  try {
    await addbanwords.handleMessage(message);
  } catch (error) {
    console.error('Error in message handler:', error);
  }
});

// Login the bot
client.login(process.env.TOKEN);