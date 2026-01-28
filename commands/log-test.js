const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-test')
        .setDescription('Log sistemini test eder'),

    async execute(interaction) {
        const logChannelId = configManager.getLogChannel(interaction.guild.id);

        if (!logChannelId) {
            return interaction.reply({
                content: '❌ Log kanalı ayarlanmamış! `/log-kanal-ayarla` komutunu kullanarak ayarlayın.',
                ephemeral: true
            });
        }

        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        if (!logChannel) {
            return interaction.reply({
                content: '❌ Log kanalı bulunamadı! Lütfen tekrar ayarlayın.',
                ephemeral: true
            });
        }

        // Test embed'i gönder
        const testEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Log Sistemi Test')
            .setDescription('Log sistemi başarıyla çalışıyor!')
            .addFields(
                { name: '👤 Test Eden', value: `${interaction.user.tag}`, inline: true },
                { name: '📢 Log Kanalı', value: `${logChannel}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Log Test Sistemi' });

        try {
            await logChannel.send({ embeds: [testEmbed] });

            return interaction.reply({
                content: `✅ Test mesajı ${logChannel} kanalına gönderildi!`,
                ephemeral: true
            });
        } catch (error) {
            return interaction.reply({
                content: '❌ Test mesajı gönderilirken bir hata oluştu!',
                ephemeral: true
            });
        }
    }
};
