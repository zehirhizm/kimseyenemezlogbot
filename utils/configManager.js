const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'config.json');

/**
 * Config dosyası yönetimi - Sunucu bazlı ayarlar
 */
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    /**
     * Config dosyasını yükle
     */
    loadConfig() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('❌ Config yükleme hatası:', error);
        }
        return {};
    }

    /**
     * Config dosyasını kaydet
     */
    saveConfig() {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('❌ Config kaydetme hatası:', error);
            return false;
        }
    }

    /**
     * Log kanalı ID'sini ayarla
     */
    setLogChannel(guildId, channelId) {
        if (!this.config[guildId]) {
            this.config[guildId] = {};
        }
        this.config[guildId].logChannelId = channelId;
        return this.saveConfig();
    }

    /**
     * Log kanalı ID'sini al
     */
    getLogChannel(guildId) {
        return this.config[guildId]?.logChannelId || null;
    }

    /**
     * Sunucu ayarlarını al
     */
    getGuildConfig(guildId) {
        return this.config[guildId] || {};
    }

    /**
     * Sunucu ayarını güncelle
     */
    updateGuildConfig(guildId, key, value) {
        if (!this.config[guildId]) {
            this.config[guildId] = {};
        }
        this.config[guildId][key] = value;
        return this.saveConfig();
    }
}

module.exports = new ConfigManager();
