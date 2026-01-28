const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-kanal-ayarla')
        .setDescription('Log mesajlarının gönderileceği kanalı ayarlar')
        .addChannelOption(option =>
            option
                .setName('kanal')
                .setDescription('Log kanalı')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channel = interaction.options.getChannel('kanal');

        // Kanal text kanalı mı kontrol et
        if (channel.type !== 0) { // 0 = GUILD_TEXT
            return interaction.reply({
                content: '❌ Lütfen bir metin kanalı seçin!',
                ephemeral: true
            });
        }

        // Config'e kaydet
        const success = configManager.setLogChannel(interaction.guild.id, channel.id);

        if (success) {
            return interaction.reply({
                content: `✅ Log kanalı ${channel} olarak ayarlandı!`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                content: '❌ Log kanalı ayarlanırken bir hata oluştu!',
                ephemeral: true
            });
        }
    }
};
