const fs = require('fs');
const path = require('path');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

const allowedDomainsFilePath = path.join(__dirname, '..', 'allowedDomains.json');
const domainRequestsFilePath = path.join(__dirname, '..', 'domainRequests.json');

let allowedDomains = new Set();
let domainRequests = new Map();

// Load existing allowed domains
try {
    const data = fs.readFileSync(allowedDomainsFilePath, 'utf8');
    const loadedAllowedDomains = JSON.parse(data);
    allowedDomains = new Set(loadedAllowedDomains);
    console.log('Loaded allowed domains:', Array.from(allowedDomains));
} catch (error) {
    console.log('No existing allowed domains file, creating new one');
    fs.writeFileSync(allowedDomainsFilePath, JSON.stringify([], null, 2));
}

// Load existing domain requests
try {
    const data = fs.readFileSync(domainRequestsFilePath, 'utf8');
    domainRequests = new Map(JSON.parse(data));
} catch (error) {
    console.log('No existing domain requests file, creating new one');
    fs.writeFileSync(domainRequestsFilePath, JSON.stringify([]), null, 2);
}

function saveDomainRequests() {
    fs.writeFileSync(domainRequestsFilePath, JSON.stringify(Array.from(domainRequests), null, 2));
}

function saveAllowedDomains() {
    fs.writeFileSync(allowedDomainsFilePath, JSON.stringify(Array.from(allowedDomains), null, 2));
}

function getDomainFromUrl(url) {
    try {
        return url.toLowerCase()
            .replace(/^(https?:\/\/)?(www\.)?/, '')
            .split('/')[0];
    } catch (error) {
        console.error('Error extracting domain:', error);
        return null;
    }
}

// Helper function to safely reply to interactions
async function safeReply(interaction, content) {
    try {
        if (interaction.replied) {
            return await interaction.followUp(content);
        } else if (interaction.deferred) {
            return await interaction.editReply(content);
        } else {
            return await interaction.reply(content);
        }
    } catch (error) {
        console.error('Error in safeReply:', error);
    }
}

module.exports = {
    handleInteraction: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.commandName) {
            case 'setalloweddomain': {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                    return safeReply(interaction, {
                        content: 'You need Moderator Permission to manage allowed domains.',
                        ephemeral: true
                    });
                }

                const domain = getDomainFromUrl(interaction.options.getString('domain'));
                if (!domain) {
                    return safeReply(interaction, {
                        content: 'Invalid domain format.',
                        ephemeral: true
                    });
                }

                allowedDomains.add(domain);
                saveAllowedDomains();

                return safeReply(interaction, {
                    content: `Successfully added "${domain}" to the allowed domains list.`,
                    ephemeral: true
                });
            }

            case 'removealloweddomain': {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                    return safeReply(interaction, {
                        content: 'You need Moderator Permission to manage allowed domains.',
                        ephemeral: true
                    });
                }

                const domain = getDomainFromUrl(interaction.options.getString('domain'));
                if (!domain || !allowedDomains.has(domain)) {
                    return safeReply(interaction, {
                        content: 'Domain not found in allowed list.',
                        ephemeral: true
                    });
                }

                allowedDomains.delete(domain);
                saveAllowedDomains();

                return safeReply(interaction, {
                    content: `Removed "${domain}" from allowed domains.`,
                    ephemeral: true
                });
            }

            case 'listalloweddomains': {
                const embed = new EmbedBuilder()
                    .setTitle('Allowed Domains')
                    .setDescription(Array.from(allowedDomains).join('\n') || 'No domains allowed yet.')
                    .setColor(0x00FF00);

                return safeReply(interaction, {
                    embeds: [embed],
                    ephemeral: true
                });
            }

            case 'requestdomain': {
                const domain = getDomainFromUrl(interaction.options.getString('domain'));
                if (!domain) {
                    return safeReply(interaction, {
                        content: 'Invalid domain format.',
                        ephemeral: true
                    });
                }

                if (allowedDomains.has(domain)) {
                    return safeReply(interaction, {
                        content: 'This domain is already allowed!',
                        ephemeral: true
                    });
                }

                domainRequests.set(domain, {
                    requestedBy: interaction.user.id,
                    requestedAt: new Date().toISOString(),
                    username: interaction.user.tag
                });
                saveDomainRequests();

                return safeReply(interaction, {
                    content: `Your request to add "${domain}" has been submitted for moderator review.`,
                    ephemeral: true
                });
            }

            case 'listdomainrequests': {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                    return safeReply(interaction, {
                        content: 'You need Moderator Permission to view requests.',
                        ephemeral: true
                    });
                }

                const requests = Array.from(domainRequests.entries());
                const embed = new EmbedBuilder()
                    .setTitle('Domain Requests')
                    .setDescription(requests.length ? requests.map(([domain, info]) =>
                        `Domain: ${domain}\nRequested by: ${info.username}\nRequested: ${new Date(info.requestedAt).toLocaleString()}`
                    ).join('\n\n') : 'No pending requests')
                    .setColor(0x00FF00);

                return safeReply(interaction, {
                    embeds: [embed],
                    ephemeral: true
                });
            }

            default:
                return; // Let the main handler handle unknown commands
        }
    },
    handleMessage: async (message) => {
        if (message.author.bot) return;

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        if (!urls) return;

        console.log('Found URLs:', urls);
        const unauthorizedUrls = urls.filter(url => {
            const domain = getDomainFromUrl(url);
            console.log('Checking domain:', domain);
            return domain && !allowedDomains.has(domain);
        });

        if (unauthorizedUrls.length > 0) {
            try {
                // Delete message immediately
                await message.delete();

                // Create warning embed
                const warningEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚠️ Unauthorized Domain')
                    .setDescription(`Your message was removed because it contained unauthorized domains.\n\nAllowed domains:\n${Array.from(allowedDomains).join('\n')}`)
                    .setFooter({ text: 'Use /requestdomain to request a new domain to be added' });

                // Try to send DM first
                try {
                    await message.author.send({ embeds: [warningEmbed] });
                } catch (dmError) {
                    // If DM fails, send temporary message in channel that only the user can see
                    try {
                        // Create a temporary private thread
                        const thread = await message.channel.threads.create({
                            name: '🔒 Domain Warning',
                            autoArchiveDuration: 60,
                            type: 12, // GUILD_PRIVATE_THREAD
                            invitable: false,
                            reason: 'Temporary warning message'
                        });

                        // Only add the user who sent the message
                        await thread.members.add(message.author.id);

                        // Send the warning in the thread
                        await thread.send({
                            content: `<@${message.author.id}>`,
                            embeds: [warningEmbed]
                        });

                        // Delete the thread after 5 seconds
                        setTimeout(async () => {
                            try {
                                await thread.delete();
                            } catch (deleteError) {
                                console.error('Error deleting thread:', deleteError);
                            }
                        }, 5000);
                    } catch (threadError) {
                        console.error('Error creating warning thread:', threadError);
                        // Last resort: Whisper to the user (ephemeral message if possible)
                        if (message.channel.type === 0) { // GUILD_TEXT
                            try {
                                await message.channel.send({
                                    content: `<@${message.author.id}>`,
                                    embeds: [warningEmbed],
                                    flags: 64 // Ephemeral flag
                                });
                            } catch (whisperError) {
                                console.error('Error sending whisper:', whisperError);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling unauthorized domain:', error);
            }
        }
    }
};