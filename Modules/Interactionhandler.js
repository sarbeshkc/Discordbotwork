const fs = require('fs');
const csv = require('csv-parser');
const Discord = require("discord.js");

const MEMBER_ROLE_ID = "1295230774588608562"; // Replace with your role ID

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
const allowedSiteManager = require('../src/commands/addallowedsite.js')

require("dotenv").config();


module.exports = async (interaction) => {

    //Add The Conditionals for Interaction Identifier Here and Send Flow to the Function Directly if no Race Condition Asynchronously if has a Race Condition
    // if (interaction.commandName==='createrole'){
    //     createrole(interaction)
    //     return;
    // }
    //Example Use
    try {
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'accept_coc': {
                    try {
                        // Get the role
                        const memberRole = interaction.guild.roles.cache.get(MEMBER_ROLE_ID);
                        
                        if (!memberRole) {
                            console.error('Member role not found');
                            await interaction.reply({
                                content: 'There was an error assigning your role. Please contact an administrator.',
                                ephemeral: true
                            });
                            return;
                        }

                        // Check if user already has the role
                        if (interaction.member.roles.cache.has(MEMBER_ROLE_ID)) {
                            await interaction.reply({
                                content: 'You have already accepted the Code of Conduct.',
                                ephemeral: true
                            });
                            return;
                        }

                        // Add the role
                        await interaction.member.roles.add(memberRole);

                        // Reply with success message
                        await interaction.reply({
                            content: 'Thank you for accepting the Code of Conduct! Welcome to IT Meet 2024.\nYou have been given the Techie role.',
                            ephemeral: true
                        });

                        // Log the role assignment
                        console.log(`Assigned member role to ${interaction.user.tag}`);
                    } catch (error) {
                        console.error('Error handling CoC acceptance:', error);
                        if (!interaction.replied) {
                            await interaction.reply({
                                content: 'There was an error processing your request. Please contact an administrator.',
                                ephemeral: true
                            });
                        }
                    }
                    return;
                }
                // Add other button handlers here if needed
            }
        }


        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            let commandHandled = false;

            switch (interaction.commandName) {
                case 'addbanword':
                    await addBanWordCommand.handelinteraction(interaction);
                    commandHandled = true;
                    break;

                case 'setalloweddomain':
                case 'removealloweddomain':
                case 'listalloweddomains':
                case 'requestdomain':
                case 'listdomainrequests':
                    await allowedSiteManager.handleInteraction(interaction);
                    commandHandled = true;
                    break;
            }

            // Only send unknown command message if command wasn't handled
            if (!commandHandled && !interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'Unknown command.',
                    ephemeral: true
                });
            }
        }
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
