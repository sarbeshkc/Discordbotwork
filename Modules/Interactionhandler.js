const fs = require('fs');
const csv = require('csv-parser');
const Discord = require("discord.js");



const {
    Client,
    IntentsBitField,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");


//All Sub-Modules Imports Goes Here 
const addBanWordCommand = require('../src/commands/addbanWord.js');

require("dotenv").config();


module.exports = async (interaction) => {

    //Add The Conditionals for Interaction Identifier Here and Send Flow to the Function Directly if no Race Condition Asynchronously if has a Race Condition
    // if (interaction.commandName==='createrole'){
    //     createrole(interaction)
    //     return;
    // }
    //Example Use
    try {
        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'addbanword':
                    await addBanWordCommand.handelinteraction(interaction);
                    break;

                // Add other commands here
                default:
                    await interaction.reply({
                        content: 'Unknown command.',
                        ephemeral: true
                    });
            }
        }

        // Add other interaction types here if needed

    } catch (error) {
        console.error('Error in interaction handler:', error);
        try {
            const errorMessage = {
                content: 'There was an error processing your request.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        } catch (e) {
            console.error('Error sending error message:', e);
        }
    }
};
