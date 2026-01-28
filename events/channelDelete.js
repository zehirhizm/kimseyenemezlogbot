const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        if (!channel.guild) return;

        try {
            const embed = LogEmbedBuilder.channelDelete(channel);
            await Logger.send(channel.guild, embed);
        } catch (error) {
            console.error('❌ channelDelete event hatası:', error);
        }
    }
};
