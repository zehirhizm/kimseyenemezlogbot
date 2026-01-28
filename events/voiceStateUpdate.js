const LogEmbedBuilder = require('../utils/embedBuilder');
const Logger = require('../utils/logger');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        try {
            const member = newState.member;
            const oldChannel = oldState.channel;
            const newChannel = newState.channel;

            // Kanal değişikliği var mı?
            const channelChanged = oldChannel?.id !== newChannel?.id;

            // Ses durumu değişiklikleri var mı?
            const serverMuteChanged = oldState.mute !== newState.mute;
            const serverDeafChanged = oldState.deaf !== newState.deaf;
            const selfMuteChanged = oldState.selfMute !== newState.selfMute;
            const selfDeafChanged = oldState.selfDeaf !== newState.selfDeaf;
            const videoChanged = oldState.selfVideo !== newState.selfVideo;
            const streamingChanged = oldState.streaming !== newState.streaming;

            const stateChanged = serverMuteChanged || serverDeafChanged || selfMuteChanged ||
                selfDeafChanged || videoChanged || streamingChanged;

            // Hiçbir değişiklik yoksa çık
            if (!channelChanged && !stateChanged) return;

            // SADECE KANAL DEĞİŞİKLİĞİ VARSA
            if (channelChanged && !stateChanged) {
                // Normal kanal değişikliği logu gönder
                const embed = LogEmbedBuilder.voiceChannelChange(member, oldChannel, newChannel);
                await Logger.send(newState.guild, embed);
                return;
            }

            // SES DURUMU DEĞİŞİKLİĞİ VAR (kanal değişikliği olsun veya olmasın)
            if (stateChanged && newChannel) {
                const changes = [];
                let moderator = null;

                // Moderatör kontrolü
                if (serverMuteChanged || serverDeafChanged) {
                    try {
                        const auditLogs = await newState.guild.fetchAuditLogs({
                            type: 24, // MEMBER_UPDATE
                            limit: 5
                        });

                        const log = auditLogs.entries.find(entry =>
                            entry.target && // NULL kontrolü
                            entry.target.id === member.id &&
                            (Date.now() - entry.createdTimestamp) < 5000
                        );

                        if (log) {
                            moderator = log.executor;
                            console.log(`✅ Server mute/deaf moderatörü tespit edildi: ${moderator.tag} -> ${member.user.tag}`);
                        }
                    } catch (error) {
                        console.error('❌ Audit log kontrolü hatası:', error);
                    }
                }

                // Server mute/deaf için ayrı embed
                const isServerAction = serverMuteChanged || serverDeafChanged;
                const isSelfAction = selfMuteChanged || selfDeafChanged || videoChanged || streamingChanged;

                // Değişiklikleri ekle
                if (serverMuteChanged) {
                    changes.push({
                        name: '🎤 Mikrofon',
                        value: newState.mute ? '🔴 Kapalı' : '🟢 Açık',
                        inline: true
                    });
                }

                if (serverDeafChanged) {
                    changes.push({
                        name: '🔊 Kulaklık',
                        value: newState.deaf ? '🔴 Kapalı' : '🟢 Açık',
                        inline: true
                    });
                }

                if (selfMuteChanged) {
                    changes.push({
                        name: '🎙️ Kendi Susturma',
                        value: newState.selfMute ? '🔴 Susturuldu' : '🟢 Açıldı',
                        inline: true
                    });
                }

                if (selfDeafChanged) {
                    changes.push({
                        name: '🔇 Kendi Sağırlaştırma',
                        value: newState.selfDeaf ? '🔴 Sağırlaştırıldı' : '🟢 Açıldı',
                        inline: true
                    });
                }

                if (videoChanged) {
                    changes.push({
                        name: '📹 Kamera',
                        value: newState.selfVideo ? '🟢 Açıldı' : '🔴 Kapatıldı',
                        inline: true
                    });
                }

                if (streamingChanged) {
                    changes.push({
                        name: '🖥️ Ekran Paylaşımı',
                        value: newState.streaming ? '🟢 Başlatıldı' : '🔴 Durduruldu',
                        inline: true
                    });
                }

                // Kanal bilgisi ekle
                changes.push({
                    name: '📢 Kanal',
                    value: `\`${newChannel.name}\``,
                    inline: false
                });

                // Moderatör varsa ekle
                if (moderator) {
                    changes.push({
                        name: '👮 İşlemi Yapan',
                        value: `${moderator}`,
                        inline: false
                    });
                }

                // Server mute/deaf ise özel embed, değilse normal ses durumu embed'i
                let embed;
                if (isServerAction && !isSelfAction) {
                    // Sadece server mute/deaf varsa
                    embed = LogEmbedBuilder.serverMuteDeaf(member, changes, moderator);
                } else {
                    // Diğer ses durumu değişiklikleri
                    embed = LogEmbedBuilder.voiceStateChange(member, changes);
                }

                await Logger.send(newState.guild, embed);
            }

        } catch (error) {
            console.error('❌ voiceStateUpdate event hatası:', error);
        }
    }
};
