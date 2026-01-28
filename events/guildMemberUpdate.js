const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        try {
            // Rol değişikliği kontrolü
            const oldRoles = oldMember.roles.cache;
            const newRoles = newMember.roles.cache;

            const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
            const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

            if (addedRoles.size > 0 || removedRoles.size > 0) {
                let moderator = null;

                // Audit log'dan kimin rol verdiğini/aldığını bul
                try {
                    const auditLogs = await newMember.guild.fetchAuditLogs({
                        type: 25, // MEMBER_ROLE_UPDATE
                        limit: 5
                    });

                    const roleLog = auditLogs.entries.find(log =>
                        log.target &&
                        log.target.id === newMember.id &&
                        (Date.now() - log.createdTimestamp) < 5000
                    );

                    if (roleLog) {
                        moderator = roleLog.executor;
                        console.log(`✅ Rol değişikliği moderatörü tespit edildi: ${moderator.tag} -> ${newMember.user.tag}`);
                    }
                } catch (error) {
                    console.error('❌ Audit log kontrolü hatası:', error);
                }

                const embed = LogEmbedBuilder.roleChange(
                    newMember,
                    Array.from(addedRoles.values()),
                    Array.from(removedRoles.values()),
                    moderator
                );
                await Logger.send(newMember.guild, embed);
            }

            // Nickname değişikliği kontrolü
            if (oldMember.nickname !== newMember.nickname) {
                const embed = LogEmbedBuilder.nicknameChange(
                    newMember,
                    oldMember.nickname,
                    newMember.nickname
                );
                await Logger.send(newMember.guild, embed);
            }

            // Timeout (zaman aşımı) kontrolü
            const oldTimeout = oldMember.communicationDisabledUntil;
            const newTimeout = newMember.communicationDisabledUntil;

            if (!oldTimeout && newTimeout) {
                // Timeout verildi
                const duration = `<t:${Math.floor(newTimeout.getTime() / 1000)}:R>`;

                // Audit log'dan moderatörü bul
                const auditLogs = await newMember.guild.fetchAuditLogs({
                    type: 24, // MEMBER_UPDATE
                    limit: 1
                });
                const log = auditLogs.entries.first();
                const moderator = log?.executor;

                const embed = LogEmbedBuilder.timeout(newMember, duration, moderator);
                await Logger.send(newMember.guild, embed);
            } else if (oldTimeout && !newTimeout) {
                // Timeout kaldırıldı
                const auditLogs = await newMember.guild.fetchAuditLogs({
                    type: 24, // MEMBER_UPDATE
                    limit: 1
                });
                const log = auditLogs.entries.first();
                const moderator = log?.executor;

                const embed = LogEmbedBuilder.timeoutRemove(newMember, moderator);
                await Logger.send(newMember.guild, embed);
            }

        } catch (error) {
            console.error('❌ guildMemberUpdate event hatası:', error);
        }
    }
};
