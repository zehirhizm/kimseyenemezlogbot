const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (!newMessage.guild) return;
        if (oldMessage.content === newMessage.content) return; // İçerik değişmediyse logla

        try {
            const embed = LogEmbedBuilder.messageUpdate(oldMessage, newMessage);
            await Logger.send(newMessage.guild, embed);
        } catch (error) {
            console.error('❌ messageUpdate event hatası:', error);
        }
    }
};
