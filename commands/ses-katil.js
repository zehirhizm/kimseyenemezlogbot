const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ses-gel')
        .setDescription('Bot\'u ses kanalına katılır')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Kullanıcının ses kanalında olup olmadığını kontrol et
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ Önce bir ses kanalına katılmalısın!',
                ephemeral: true
            });
        }

        // Bot zaten bir ses kanalında mı?
        const existingConnection = getVoiceConnection(interaction.guild.id);
        if (existingConnection) {
            return interaction.reply({
                content: '⚠️ Bot zaten bir ses kanalında!',
                ephemeral: true
            });
        }

        try {
            // Ses kanalına katıl
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true, // Sağırlaştırılmış
                selfMute: false
            });

            await interaction.reply({
                content: `✅ **${voiceChannel.name}** ses kanalına katıldım!`,
                ephemeral: true
            });

            console.log(`🔊 Bot ses kanalına katıldı: ${voiceChannel.name}`);
        } catch (error) {
            console.error('❌ Ses kanalına katılma hatası:', error);
            await interaction.reply({
                content: '❌ Ses kanalına katılırken bir hata oluştu!',
                ephemeral: true
            });
        }
    }
};
