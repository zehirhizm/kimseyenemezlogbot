const configManager = require('./configManager');

/**
 * Log mesajı gönderme helper fonksiyonu
 */
class Logger {
    /**
     * Log embed'ini belirtilen sunucunun log kanalına gönder
     */
    static async send(guild, embed) {
        try {
            // Log kanalı ID'sini al
            const logChannelId = configManager.getLogChannel(guild.id);

            if (!logChannelId) {
                console.log(`⚠️ ${guild.name} sunucusu için log kanalı ayarlanmamış`);
                return false;
            }

            // Kanalı bul
            const logChannel = guild.channels.cache.get(logChannelId);

            if (!logChannel) {
                console.log(`⚠️ Log kanalı bulunamadı: ${logChannelId}`);
                return false;
            }

            // Embed'i gönder
            await logChannel.send({ embeds: [embed] });
            return true;

        } catch (error) {
            console.error('❌ Log gönderme hatası:', error);
            return false;
        }
    }

    /**
     * Birden fazla embed gönder
     */
    static async sendMultiple(guild, embeds) {
        try {
            const logChannelId = configManager.getLogChannel(guild.id);

            if (!logChannelId) {
                console.log(`⚠️ ${guild.name} sunucusu için log kanalı ayarlanmamış`);
                return false;
            }

            const logChannel = guild.channels.cache.get(logChannelId);

            if (!logChannel) {
                console.log(`⚠️ Log kanalı bulunamadı: ${logChannelId}`);
                return false;
            }

            await logChannel.send({ embeds });
            return true;

        } catch (error) {
            console.error('❌ Log gönderme hatası:', error);
            return false;
        }
    }
}

module.exports = Logger;
