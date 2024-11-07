const fs = require('fs');
const path = require('path');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

const bannedWordsFilePath = path.join(__dirname, 'bannedWords.json');
const warningsFilePath = path.join(__dirname, 'userWarnings.json');

let bannedWords = new Set();
let userWarnings = new Map();

// Load existing banned words
try {
    const data = fs.readFileSync(bannedWordsFilePath, 'utf8');
    const loadedBannedWords = JSON.parse(data);
    bannedWords = new Set(loadedBannedWords);
} catch (error) {
    console.log('No existing banned words file, creating new one');
    fs.writeFileSync(bannedWordsFilePath, JSON.stringify([], null, 2));
}

// Load existing warnings
try {
    const data = fs.readFileSync(warningsFilePath, 'utf8');
    userWarnings = new Map(JSON.parse(data));
} catch (error) {
    console.log('No existing warnings file, creating new one');
    fs.writeFileSync(warningsFilePath, JSON.stringify([]), null, 2);
}

function saveWarnings() {
    const warningsArray = Array.from(userWarnings.entries());
    fs.writeFileSync(warningsFilePath, JSON.stringify(warningsArray, null, 2));
}

function getUserWarnings(userId) {
    return userWarnings.get(userId) || 0;
}

module.exports = {
    handelinteraction: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;
            
            if (interaction.commandName === "addbanword") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({
                        content: 'You need Administrative Permission to add banned words.',
                        ephemeral: true
                    });
                }

                const wordToAdd = interaction.options.getString('word').toLowerCase().trim();

                if (bannedWords.has(wordToAdd)) {
                    return interaction.reply({
                        content: 'This word is already in the banned list.',
                        ephemeral: true
                    });
                }

                bannedWords.add(wordToAdd);
                fs.writeFileSync(
                    bannedWordsFilePath,
                    JSON.stringify(Array.from(bannedWords), null, 2)
                );

                await interaction.reply({
                    content: `Successfully added "${wordToAdd}" to the banned words list.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error in addbanword command:', error);
        }
    },

    handleMessage: async (message) => {
        if (message.author.bot) return;

        const messageContent = message.content.toLowerCase();
        const containsBannedWord = Array.from(bannedWords).some(word => {
            const pattern = new RegExp(`\\b${word}\\b`, 'i');
            return pattern.test(messageContent);
        });

        if (containsBannedWord) {
            try {
                // Delete message immediately
                await message.delete().catch(console.error);

                // Get current warnings
                const currentWarnings = getUserWarnings(message.author.id);
                const newWarningCount = currentWarnings + 1;
                
                // Update warnings
                userWarnings.set(message.author.id, newWarningCount);
                saveWarnings();

                // Create ephemeral warning message
                let warningMessage;
                if (newWarningCount < 3) {
                    warningMessage = `⚠️ Warning ${newWarningCount}/3: Your message was removed for containing inappropriate content.`;
                } else {
                    warningMessage = '⚠️ Final warning: You have reached the maximum number of warnings and will be kicked.';
                }

                // Send ephemeral warning
                try {
                    const warningReply = await message.channel.send({
                        content: warningMessage,
                        ephemeral: true,
                        target: message.author
                    });

                    // Delete warning after 5 seconds if not the final warning
                    if (newWarningCount < 3) {
                        setTimeout(() => {
                            warningReply.delete().catch(() => {});
                        }, 5000);
                    }

                    // If this is the third warning, wait a moment then kick
                    if (newWarningCount >= 3) {
                        // Send DM before kick
                        try {
                            await message.author.send({
                                content: 'You have been kicked from the server for multiple violations of our content policy.'
                            });
                        } catch (dmError) {
                            console.log('Could not send DM to user before kick');
                        }

                        // Wait 5 seconds then kick
                        setTimeout(async () => {
                            try {
                                await message.member.kick('Received 3 warnings for using banned words');
                                // Reset warnings after successful kick
                                userWarnings.set(message.author.id, 0);
                                saveWarnings();
                            } catch (kickError) {
                                console.error('Error kicking user:', kickError);
                            }
                        }, 5000);
                    }
                } catch (replyError) {
                    console.error('Error sending warning message:', replyError);
                }
            } catch (error) {
                console.error('Error handling banned word:', error);
            }
        }
    },

    getBannedWords: () => Array.from(bannedWords),
    isBannedWord: (word) => bannedWords.has(word.toLowerCase()),
    checkWarnings: (userId) => getUserWarnings(userId),
    resetWarnings: (userId) => {
        userWarnings.set(userId, 0);
        saveWarnings();
    }
};