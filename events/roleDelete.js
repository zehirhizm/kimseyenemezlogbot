const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'roleDelete',
    async execute(role) {
        try {
            const embed = LogEmbedBuilder.roleDelete(role);
            await Logger.send(role.guild, embed);
        } catch (error) {
            console.error('❌ roleDelete event hatası:', error);
        }
    }
};
