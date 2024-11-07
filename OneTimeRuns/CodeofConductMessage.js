const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client) => {
    const COC_CHANNEL_ID = "1300361500401074176";
    
    try {
        // Fetch the channel
        const cocChannel = await client.channels.fetch(COC_CHANNEL_ID);
        if (!cocChannel) {
            console.error('Code of Conduct channel not found');
            return;
        }

        console.log('Checking for existing Code of Conduct message...');

        // Fetch existing messages
        const messages = await cocChannel.messages.fetch({ limit: 100 });
        const existingCoC = messages.find(msg => 
            msg.embeds.length > 0 && 
            (msg.embeds[0].title === '🌟 Welcome to IT Meet 2024 🌟' ||
             msg.embeds[0].title === '📜 Code of Conduct')
        );

        if (existingCoC) {
            console.log('Code of Conduct message already exists. Skipping setup.');
            return;
        }

        console.log('No existing Code of Conduct found. Creating new message...');

        const eventEmbed = new EmbedBuilder()
            .setColor('#4B0082')
            .setTitle('🌟 Welcome to IT Meet 2024 🌟')
            .setDescription('Embark on a journey of innovation, learning, and networking at Nepal\'s premier tech event!')
            .setImage('https://cdn.discordapp.com/attachments/1295241381450612817/1295283833737969735/itmeetdark-DnypBxI5.webp?ex=670e1693&is=670cc513&hm=6a48eadb0516f6fa4ac9a754d34bf380f31c924be0c43c784ba297d010264cd0&')
            .addFields(
                { name: '🗓️ Event Date', value: 'March 15-17, 2024', inline: true },
                { name: '📍 Location', value: 'Virtual & Kathmandu University', inline: true },
                { name: '🎯 Theme', value: 'Shaping the Digital Future', inline: true }
            );

        const highlightsEmbed = new EmbedBuilder()
            .setColor('#6A0DAD')
            .setTitle('🚀 Event Highlights')
            .addFields(
                { name: '💡 Inspiring Keynotes', value: 'Hear from industry leaders and visionaries' },
                { name: '🛠️ Interactive Workshops', value: 'Gain hands-on experience with cutting-edge technologies' },
                { name: '🏆 Hackathon', value: 'Showcase your skills and win exciting prizes' },
                { name: '🤝 Networking Sessions', value: 'Connect with peers, mentors, and potential employers' },
                { name: '🎭 Tech Expo', value: 'Explore innovative projects and emerging technologies' }
            );

        const cocEmbed = new EmbedBuilder()
            .setColor('#9932CC')
            .setTitle('📜 Code of Conduct')
            .setDescription('To ensure a positive experience for all, please adhere to these guidelines:')
            .addFields(
                { name: '🤝 Respect & Inclusivity', value: 'Treat all participants with respect, regardless of background or identity.' },
                { name: '🗣️ Professional Communication', value: 'Use appropriate language and maintain a professional demeanor in all interactions.' },
                { name: '🚫 No Harassment', value: 'Any form of harassment or discrimination will not be tolerated.' },
                { name: '🔒 Privacy & Consent', value: 'Respect others\' privacy and obtain consent before sharing personal information or photos.' },
                { name: '🎯 Stay on Topic', value: 'Keep discussions relevant to the event and its themes.' },
                { name: '🆘 Report Issues', value: 'If you experience or witness any violations, please report to the organizers immediately.' }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept_coc')
                    .setLabel('I Accept the Code of Conduct')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
            );

        // Send the embeds
        await cocChannel.send({ 
            embeds: [eventEmbed, highlightsEmbed, cocEmbed], 
            components: [row] 
        });

        console.log('Code of Conduct message sent successfully');

    } catch (error) {
        console.error('Error in setupCodeOfConduct:', error);
    }
};