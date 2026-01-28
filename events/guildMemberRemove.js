const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            const embed = LogEmbedBuilder.memberLeave(member);
            await Logger.send(member.guild, embed);
        } catch (error) {
            console.error('❌ guildMemberRemove event hatası:', error);
        }
    }
};
