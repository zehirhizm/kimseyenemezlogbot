const { EmbedBuilder } = require('discord.js');

/**
 * Modern embed şablonları - Her log türü için özelleştirilmiş renkler ve tasarım
 */

class LogEmbedBuilder {
    /**
     * Üyenin en yüksek rolünün rengini al
     */
    static getMemberColor(member) {
        if (!member || !member.roles) return '#95A5A6'; // Varsayılan gri
        const role = member.roles.highest;
        return role && role.color !== 0 ? role.color : '#95A5A6';
    }

    /**
     * Mesaj silme logu
     */
    static messageDelete(message, author) {
        return new EmbedBuilder()
            .setColor('#FF0000') // Kırmızı
            .setAuthor({
                name: `${author.tag}`,
                iconURL: author.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`🗑️ **Mesaj Silindi**\n\n**Kanal:** ${message.channel}`)
            .addFields(
                { name: '👤 Mesaj Sahibi', value: `**${author.username}** (\`${author.tag}\`)\nID: \`${author.id}\``, inline: false },
                { name: '📝 Mesaj İçeriği', value: message.content || '*İçerik bulunamadı*', inline: false },
                { name: '🆔 Mesaj ID', value: `\`${message.id}\``, inline: true },
                { name: '📅 Gönderilme', value: message.createdAt ? `<t:${Math.floor(message.createdAt.getTime() / 1000)}:R>` : 'Bilinmiyor', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Mesaj Log Sistemi • bugün saat' });
    }

    /**
     * Mesaj düzenleme logu
     */
    static messageUpdate(oldMessage, newMessage) {
        return new EmbedBuilder()
            .setColor('#FFA500') // Turuncu
            .setAuthor({
                name: `${newMessage.author.tag}`,
                iconURL: newMessage.author.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`✏️ **Mesaj Düzenlendi**\n\n**Kanal:** ${newMessage.channel}`)
            .addFields(
                { name: '👤 Mesaj Sahibi', value: `**${newMessage.author.username}** (\`${newMessage.author.tag}\`)\nID: \`${newMessage.author.id}\``, inline: false },
                { name: '📝 Eski İçerik', value: oldMessage.content || '*İçerik bulunamadı*', inline: false },
                { name: '📝 Yeni İçerik', value: newMessage.content || '*İçerik bulunamadı*', inline: false },
                { name: '🔗 Mesaja Git', value: `[Tıkla](${newMessage.url})`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Mesaj Log Sistemi • bugün saat' });
    }

    /**
     * Üye katılma logu
     */
    static memberJoin(member) {
        const accountAge = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));

        return new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`✅ **Yeni Üye Katıldı**\n\n${member} sunucuya katıldı!`)
            .addFields(
                { name: '🆔 Kullanıcı ID', value: `\`${member.id}\``, inline: true },
                { name: '📊 Üye Sayısı', value: `\`${member.guild.memberCount}\``, inline: true },
                { name: '📅 Hesap Oluşturma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n(${accountAge} gün önce)`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Üye Log Sistemi • bugün saat' });
    }

    /**
     * Üye ayrılma logu
     */
    static memberLeave(member) {
        const roles = member.roles.cache
            .filter(role => role.id !== member.guild.id)
            .map(role => role.name)
            .join(', ') || 'Rol yok';

        return new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`❌ **Üye Ayrıldı**\n\n${member.user.tag} sunucudan ayrıldı`)
            .addFields(
                { name: '🆔 Kullanıcı ID', value: `\`${member.id}\``, inline: true },
                { name: '📊 Üye Sayısı', value: `\`${member.guild.memberCount}\``, inline: true },
                { name: '🎭 Rolleri', value: roles.length > 1024 ? roles.substring(0, 1021) + '...' : roles, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Üye Log Sistemi • bugün saat' });
    }

    /**
     * Ban logu
     */
    static memberBan(ban, moderator = null, reason = null) {
        const fields = [
            {
                name: '👤 Banlanan Üye',
                value: `**${ban.user.username}** (\`${ban.user.tag}\`)\nID: \`${ban.user.id}\``,
                inline: false
            }
        ];

        // Moderatör bilgisi
        if (moderator) {
            fields.push({
                name: '👮 Banlayan Moderatör',
                value: `**${moderator.username}** (\`${moderator.tag}\`)\nID: \`${moderator.id}\``,
                inline: false
            });
        } else {
            fields.push({
                name: '👮 Banlayan Moderatör',
                value: '**Tespit Edilemedi**\n*Audit log izni eksik olabilir*',
                inline: false
            });
        }

        // Ban sebebi
        fields.push({
            name: '📝 Sebep',
            value: reason || '*Belirtilmemiş*',
            inline: false
        });

        return new EmbedBuilder()
            .setColor('#8B0000') // Koyu kırmızı
            .setAuthor({
                name: `${ban.user.tag}`,
                iconURL: ban.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`🔨 **Üye Banlandı**`)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Moderasyon Log Sistemi • bugün saat' });
    }

    /**
     * Ban kaldırma logu
     */
    static memberUnban(ban) {
        return new EmbedBuilder()
            .setColor('#90EE90') // Açık yeşil
            .setAuthor({
                name: `${ban.user.tag}`,
                iconURL: ban.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`🔓 **Ban Kaldırıldı**`)
            .addFields(
                { name: '🆔 Kullanıcı ID', value: `\`${ban.user.id}\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Moderasyon Log Sistemi • bugün saat' });
    }

    /**
     * Rol değişikliği logu
     */
    static roleChange(member, addedRoles, removedRoles, moderator = null) {
        const embed = new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`🎭 **Rol Değişikliği**`)
            .setTimestamp()
            .setFooter({ text: 'Rol Log Sistemi • bugün saat' });

        if (addedRoles.length > 0) {
            embed.addFields({ name: '➕ Eklenen Roller', value: addedRoles.map(r => `\`${r.name}\``).join(', '), inline: false });
        }
        if (removedRoles.length > 0) {
            embed.addFields({ name: '➖ Çıkarılan Roller', value: removedRoles.map(r => `\`${r.name}\``).join(', '), inline: false });
        }

        // Moderatör bilgisi
        if (moderator) {
            embed.addFields({
                name: '👮 İşlemi Yapan',
                value: `**${moderator.username}** (\`${moderator.tag}\`)`,
                inline: false
            });
        }

        return embed;
    }

    /**
     * Nickname değişikliği logu
     */
    static nicknameChange(member, oldNickname, newNickname) {
        return new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`📛 **Nickname Değişti**`)
            .addFields(
                { name: '🔹 Eski Nickname', value: oldNickname || '*Yok*', inline: true },
                { name: '🔸 Yeni Nickname', value: newNickname || '*Yok*', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Üye Log Sistemi • bugün saat' });
    }

    /**
     * Timeout (zaman aşımı) logu
     */
    static timeout(member, duration, moderator) {
        return new EmbedBuilder()
            .setColor('#E67E22') // Turuncu
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`⏱️ **Zaman Aşımı Verildi**`)
            .addFields(
                { name: '👮 Moderatör', value: moderator ? `${moderator}` : '*Bilinmiyor*', inline: true },
                { name: '⏰ Süre', value: duration, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Moderasyon Log Sistemi • bugün saat' });
    }

    /**
     * Timeout kaldırma logu
     */
    static timeoutRemove(member, moderator) {
        return new EmbedBuilder()
            .setColor('#2ECC71') // Yeşil
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`✅ **Zaman Aşımı Kaldırıldı**`)
            .addFields(
                { name: '👮 Moderatör', value: moderator ? `${moderator}` : '*Bilinmiyor*', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Moderasyon Log Sistemi • bugün saat' });
    }

    /**
     * Ses kanalı giriş/çıkış logu
     */
    static voiceChannelChange(member, oldChannel, newChannel) {
        let title, emoji;
        const fields = [];
        const memberColor = this.getMemberColor(member);

        if (!oldChannel && newChannel) {
            // Ses kanalına giriş
            title = 'Ses Kanalına Katıldı';
            emoji = '🔊';
            fields.push({
                name: '📥 Katıldığı Kanal',
                value: `\`${newChannel.name}\``,
                inline: false
            });
        } else if (oldChannel && !newChannel) {
            // Ses kanalından çıkış
            title = 'Ses Kanalından Ayrıldı';
            emoji = '🔇';
            fields.push({
                name: '📤 Ayrıldığı Kanal',
                value: `\`${oldChannel.name}\``,
                inline: false
            });
        } else {
            // Kanal değiştirme
            title = 'Ses Kanalı Değiştirdi';
            emoji = '🔄';
            fields.push(
                { name: '📤 Ayrıldığı Kanal', value: `\`${oldChannel.name}\``, inline: true },
                { name: '📥 Katıldığı Kanal', value: `\`${newChannel.name}\``, inline: true }
            );
        }

        return new EmbedBuilder()
            .setColor(memberColor)
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`${emoji} **${title}**`)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Ses Kanalı Log Sistemi • bugün saat' });
    }

    /**
     * Mikrofon/kulaklık değişikliği logu
     */
    static voiceStateChange(member, changes) {
        return new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription('🎙️ **Ses Durumu Değişti**')
            .addFields(changes)
            .setTimestamp()
            .setFooter({ text: 'Ses Kanalı Log Sistemi • bugün saat' });
    }

    /**
     * Sunucuda susturma/sağırlaştırma logu
     */
    static serverMuteDeaf(member, changes, moderator) {
        const embed = new EmbedBuilder()
            .setColor(this.getMemberColor(member))
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription('🔇 **Sunucuda Susturma/Sağırlaştırma**')
            .addFields(changes)
            .setTimestamp()
            .setFooter({ text: 'Ses Kanalı Log Sistemi • bugün saat' });

        return embed;
    }


    /**
     * Kanal oluşturma logu
     */
    static channelCreate(channel) {
        const channelTypes = {
            0: 'Metin Kanalı',
            2: 'Ses Kanalı',
            4: 'Kategori',
            5: 'Duyuru Kanalı',
            13: 'Stage Kanalı',
            15: 'Forum Kanalı'
        };

        return new EmbedBuilder()
            .setColor('#00FF00') // Yeşil
            .setDescription(`📢 **Kanal Oluşturuldu**\n\n**Kanal:** ${channel}`)
            .addFields(
                { name: '📝 Kanal Adı', value: `\`${channel.name}\``, inline: true },
                { name: '📂 Kanal Türü', value: channelTypes[channel.type] || 'Bilinmiyor', inline: true },
                { name: '🆔 Kanal ID', value: `\`${channel.id}\``, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Kanal Log Sistemi • bugün saat' });
    }

    /**
     * Kanal silme logu
     */
    static channelDelete(channel) {
        const channelTypes = {
            0: 'Metin Kanalı',
            2: 'Ses Kanalı',
            4: 'Kategori',
            5: 'Duyuru Kanalı',
            13: 'Stage Kanalı',
            15: 'Forum Kanalı'
        };

        return new EmbedBuilder()
            .setColor('#FF0000') // Kırmızı
            .setDescription(`🗑️ **Kanal Silindi**`)
            .addFields(
                { name: '📝 Kanal Adı', value: `\`${channel.name}\``, inline: true },
                { name: '📂 Kanal Türü', value: channelTypes[channel.type] || 'Bilinmiyor', inline: true },
                { name: '🆔 Kanal ID', value: `\`${channel.id}\``, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Kanal Log Sistemi • bugün saat' });
    }

    /**
     * Rol oluşturma logu
     */
    static roleCreate(role) {
        return new EmbedBuilder()
            .setColor(role.color || '#99AAB5')
            .setDescription(`🎭 **Rol Oluşturuldu**`)
            .addFields(
                { name: '📝 Rol Adı', value: `\`${role.name}\``, inline: true },
                { name: '🎨 Renk', value: `\`${role.hexColor}\``, inline: true },
                { name: '🆔 Rol ID', value: `\`${role.id}\``, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Rol Log Sistemi • bugün saat' });
    }

    /**
     * Rol silme logu
     */
    static roleDelete(role) {
        return new EmbedBuilder()
            .setColor(role.color || '#99AAB5')
            .setDescription(`🗑️ **Rol Silindi**`)
            .addFields(
                { name: '📝 Rol Adı', value: `\`${role.name}\``, inline: true },
                { name: '🆔 Rol ID', value: `\`${role.id}\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Rol Log Sistemi • bugün saat' });
    }
}

module.exports = LogEmbedBuilder;
