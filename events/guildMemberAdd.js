const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const embed = LogEmbedBuilder.memberJoin(member);
            await Logger.send(member.guild, embed);
        } catch (error) {
            console.error('❌ guildMemberAdd event hatası:', error);
        }
    }
};
