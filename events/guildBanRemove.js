const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'guildBanRemove',
    async execute(ban) {
        try {
            const embed = LogEmbedBuilder.memberUnban(ban);
            await Logger.send(ban.guild, embed);
        } catch (error) {
            console.error('❌ guildBanRemove event hatası:', error);
        }
    }
};
