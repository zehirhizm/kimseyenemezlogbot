const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'roleCreate',
    async execute(role) {
        try {
            const embed = LogEmbedBuilder.roleCreate(role);
            await Logger.send(role.guild, embed);
        } catch (error) {
            console.error('❌ roleCreate event hatası:', error);
        }
    }
};
