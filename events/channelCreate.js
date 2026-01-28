const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        if (!channel.guild) return;

        try {
            const embed = LogEmbedBuilder.channelCreate(channel);
            await Logger.send(channel.guild, embed);
        } catch (error) {
            console.error('❌ channelCreate event hatası:', error);
        }
    }
};
