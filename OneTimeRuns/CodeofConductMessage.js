// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// module.exports = async (client) => {
//     const COC_CHANNEL_ID = "1300361500401074176";
    
//     try {
//         // Fetch the channel
//         const cocChannel = await client.channels.fetch(COC_CHANNEL_ID);
//         if (!cocChannel) {
//             console.error('Code of Conduct channel not found');
//             return;
//         }

//         console.log('Checking for existing Code of Conduct message...');

//         // Fetch existing messages
//         const messages = await cocChannel.messages.fetch({ limit: 100 });
//         const existingCoC = messages.find(msg => 
//             msg.embeds.length > 0 && 
//             (msg.embeds[0].title === '🌟 Welcome to IT Meet 2024 🌟' ||
//              msg.embeds[0].title === '📜 Code of Conduct')
//         );

//         if (existingCoC) {
//             console.log('Code of Conduct message already exists. Skipping setup.');
//             return;
//         }

//         console.log('No existing Code of Conduct found. Creating new message...');

//         const eventEmbed = new EmbedBuilder()
//             .setColor('#4B0082')
//             .setTitle('🌟 Welcome to IT Meet 2024 🌟')
//             .setDescription('Embark on a journey of innovation, learning, and networking at Nepal\'s premier tech event!')
//             .setImage('https://cdn.discordapp.com/attachments/1295241381450612817/1295283833737969735/itmeetdark-DnypBxI5.webp?ex=670e1693&is=670cc513&hm=6a48eadb0516f6fa4ac9a754d34bf380f31c924be0c43c784ba297d010264cd0&')
//             .addFields(
//                 { name: '🗓️ Event Date', value: 'March 15-17, 2024', inline: true },
//                 { name: '📍 Location', value: 'Virtual & Kathmandu University', inline: true },
//                 { name: '🎯 Theme', value: 'Shaping the Digital Future', inline: true }
//             );

//         const highlightsEmbed = new EmbedBuilder()
//             .setColor('#6A0DAD')
//             .setTitle('🚀 Event Highlights')
//             .addFields(
//                 { name: '💡 Inspiring Keynotes', value: 'Hear from industry leaders and visionaries' },
//                 { name: '🛠️ Interactive Workshops', value: 'Gain hands-on experience with cutting-edge technologies' },
//                 { name: '🏆 Hackathon', value: 'Showcase your skills and win exciting prizes' },
//                 { name: '🤝 Networking Sessions', value: 'Connect with peers, mentors, and potential employers' },
//                 { name: '🎭 Tech Expo', value: 'Explore innovative projects and emerging technologies' }
//             );

//         const cocEmbed = new EmbedBuilder()
//             .setColor('#9932CC')
//             .setTitle('📜 Code of Conduct')
//             .setDescription('To ensure a positive experience for all, please adhere to these guidelines:')
//             .addFields(
//                 { name: '🤝 Respect & Inclusivity', value: 'Treat all participants with respect, regardless of background or identity.' },
//                 { name: '🗣️ Professional Communication', value: 'Use appropriate language and maintain a professional demeanor in all interactions.' },
//                 { name: '🚫 No Harassment', value: 'Any form of harassment or discrimination will not be tolerated.' },
//                 { name: '🔒 Privacy & Consent', value: 'Respect others\' privacy and obtain consent before sharing personal information or photos.' },
//                 { name: '🎯 Stay on Topic', value: 'Keep discussions relevant to the event and its themes.' },
//                 { name: '🆘 Report Issues', value: 'If you experience or witness any violations, please report to the organizers immediately.' }
//             );

//         const row = new ActionRowBuilder()
//             .addComponents(
//                 new ButtonBuilder()
//                     .setCustomId('accept_coc')
//                     .setLabel('I Accept the Code of Conduct')
//                     .setStyle(ButtonStyle.Success)
//                     .setEmoji('✅')
//             );

//         // Send the embeds
//         await cocChannel.send({ 
//             embeds: [eventEmbed, highlightsEmbed, cocEmbed], 
//             components: [row] 
//         });

//         console.log('Code of Conduct message sent successfully');

//     } catch (error) {
//         console.error('Error in setupCodeOfConduct:', error);
//     }
// };





const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Constants for consistent styling
const BRAND_COLORS = {
    primary: '#4B0082',      // Deep Purple
    secondary: '#6A0DAD',    // Royal Purple
    tertiary: '#9932CC',     // Dark Orchid
};

const EMOJI_SETS = {
    header: {
        welcome: '✨',
        highlights: '🎯',
        coc: '📜',
    },
    highlights: {
        keynotes: '🎤',
        workshops: '⚡',
        hackathon: '💻',
        networking: '🤝',
        expo: '🔬',
    },
    guidelines: {
        respect: '♥️',
        communication: '💭',
        harassment: '🛡️',
        privacy: '🔒',
        topic: '🎯',
        report: '🆘',
    },
};

const BANNER_IMAGE = 'https://cdn.discordapp.com/attachments/1295241381450612817/1295283833737969735/itmeetdark-DnypBxI5.webp?ex=670e1693&is=670cc513&hm=6a48eadb0516f6fa4ac9a754d34bf380f31c924be0c43c784ba297d010264cd0&';

module.exports = async (client) => {
    const COC_CHANNEL_ID = "1295298032446996511";
    
    try {
        const cocChannel = await client.channels.fetch(COC_CHANNEL_ID);
        if (!cocChannel) {
            console.error('❌ Code of Conduct channel not found');
            return;
        }

        console.log('🔍 Checking for existing Code of Conduct message...');

        // Check for existing message with improved search criteria
        const messages = await cocChannel.messages.fetch({ limit: 100 });
        const existingCoC = messages.find(msg => 
            msg.embeds.length > 0 && 
            msg.embeds[0].title?.includes('IT Meet 2024')
        );

        if (existingCoC) {
            console.log('✓ Code of Conduct message already exists. Skipping setup.');
            return;
        }

        console.log('📝 Creating new Code of Conduct message...');

        // Welcome Embed with enhanced styling
        const eventEmbed = new EmbedBuilder()
            .setColor(BRAND_COLORS.primary)
            .setTitle(`${EMOJI_SETS.header.welcome} Welcome to IT Meet 2024 ${EMOJI_SETS.header.welcome}`)
            .setDescription(
                '```md\n# Nepal\'s Premier Tech Event\n```\n' +
                'Embark on a journey of innovation, learning, and networking at this transformative tech gathering! ' +
                'Join us as we shape the future of technology together.'
            )
            .setImage(BANNER_IMAGE)
            .addFields([
                {
                    name: '\u200B',
                    value: '```md\n# Event Details\n```',
                },
                {
                    name: '🗓️ Event Date',
                    value: '```March 15-17, 2024```',
                    inline: true
                },
                {
                    name: '📍 Location',
                    value: '```Virtual & KU```',
                    inline: true
                },
                {
                    name: '🎯 Theme',
                    value: '```Digital Future```',
                    inline: true
                }
            ])
            .setFooter({ text: 'Join us in this technological revolution!' });

        // Highlights Embed with enhanced styling
        const highlightsEmbed = new EmbedBuilder()
            .setColor(BRAND_COLORS.secondary)
            .setTitle(`${EMOJI_SETS.header.highlights} Event Highlights`)
            .setDescription('```md\n# What Awaits You\n```')
            .addFields([
                {
                    name: `${EMOJI_SETS.highlights.keynotes} Inspiring Keynotes`,
                    value: '> Industry leaders sharing cutting-edge insights',
                },
                {
                    name: `${EMOJI_SETS.highlights.workshops} Interactive Workshops`,
                    value: '> Hands-on experience with emerging technologies',
                },
                {
                    name: `${EMOJI_SETS.highlights.hackathon} Hackathon Challenges`,
                    value: '> Compete, innovate, and win exciting prizes',
                },
                {
                    name: `${EMOJI_SETS.highlights.networking} Networking Hub`,
                    value: '> Connect with industry professionals and peers',
                },
                {
                    name: `${EMOJI_SETS.highlights.expo} Innovation Expo`,
                    value: '> Showcase of groundbreaking tech projects',
                }
            ]);

        // Code of Conduct Embed with enhanced styling
        const cocEmbed = new EmbedBuilder()
            .setColor(BRAND_COLORS.tertiary)
            .setTitle(`${EMOJI_SETS.header.coc} Code of Conduct`)
            .setDescription(
                '```md\n# Community Guidelines\n```\n' +
                'To foster an inclusive and collaborative environment, all participants must adhere to these guidelines:'
            )
            .addFields([
                {
                    name: `${EMOJI_SETS.guidelines.respect} Respect & Inclusivity`,
                    value: '> Embrace diversity and treat everyone with respect',
                },
                {
                    name: `${EMOJI_SETS.guidelines.communication} Professional Communication`,
                    value: '> Maintain professional and constructive dialogue',
                },
                {
                    name: `${EMOJI_SETS.guidelines.harassment} Zero Tolerance Policy`,
                    value: '> No harassment, discrimination, or inappropriate behavior',
                },
                {
                    name: `${EMOJI_SETS.guidelines.privacy} Privacy & Consent`,
                    value: '> Respect personal boundaries and data privacy',
                },
                {
                    name: `${EMOJI_SETS.guidelines.topic} Focused Discussion`,
                    value: '> Keep conversations relevant and constructive',
                },
                {
                    name: `${EMOJI_SETS.guidelines.report} Report & Support`,
                    value: '> Report concerns to moderators immediately',
                }
            ])
            .setFooter({ text: 'Creating a safe and inclusive environment for all participants' });

        // Enhanced acceptance button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept_coc')
                    .setLabel('I Accept the Code of Conduct')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
            );

        // Send the embeds with improved formatting
        await cocChannel.send({ 
            embeds: [eventEmbed, highlightsEmbed, cocEmbed], 
            components: [row] 
        });

        console.log('✅ Code of Conduct message sent successfully');

    } catch (error) {
        console.error('❌ Error in setupCodeOfConduct:', error.message);
        throw error; // Propagate error for proper handling
    }
};