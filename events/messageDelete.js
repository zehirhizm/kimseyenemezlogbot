const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        // Bot mesajlarını logla
        if (!message.guild) return;

        try {
            const embed = LogEmbedBuilder.messageDelete(message, message.author);
            await Logger.send(message.guild, embed);
        } catch (error) {
            console.error('❌ messageDelete event hatası:', error);
        }
    }
};
