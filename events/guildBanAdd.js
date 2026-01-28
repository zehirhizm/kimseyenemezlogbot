const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        try {
            let moderator = null;
            let reason = ban.reason || null; // Discord API'den gelen sebep

            // Audit log'dan kimin banladığını ve sebebi bul
            try {
                const auditLogs = await ban.guild.fetchAuditLogs({
                    type: 22, // MEMBER_BAN_ADD
                    limit: 5
                });

                const banLog = auditLogs.entries.find(log =>
                    log.target && // NULL kontrolü
                    log.target.id === ban.user.id &&
                    (Date.now() - log.createdTimestamp) < 5000
                );

                if (banLog) {
                    moderator = banLog.executor;
                    // Audit log'daki sebep varsa onu kullan (daha güncel)
                    if (banLog.reason) {
                        reason = banLog.reason;
                    }
                    console.log(`✅ Ban moderatörü tespit edildi: ${moderator.tag} -> ${ban.user.tag}, Sebep: ${reason || 'Yok'}`);
                }
            } catch (error) {
                console.error('❌ Audit log kontrolü hatası:', error);
            }

            const embed = LogEmbedBuilder.memberBan(ban, moderator, reason);
            await Logger.send(ban.guild, embed);
        } catch (error) {
            console.error('❌ guildBanAdd event hatası:', error);
        }
    }
};
