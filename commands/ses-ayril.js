const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ses-git')
        .setDescription('Bot\'u ses kanalından çıkarır')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({
                content: '❌ Bot zaten bir ses kanalında değil!',
                ephemeral: true
            });
        }

        try {
            connection.destroy();

            await interaction.reply({
                content: '✅ Ses kanalından ayrıldım!',
                ephemeral: true
            });

            console.log('🔇 Bot ses kanalından ayrıldı');
        } catch (error) {
            console.error('❌ Ses kanalından ayrılma hatası:', error);
            await interaction.reply({
                content: '❌ Ses kanalından ayrılırken bir hata oluştu!',
                ephemeral: true
            });
        }
    }
};
