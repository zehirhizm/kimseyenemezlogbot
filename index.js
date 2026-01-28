require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Bot client oluştur - TÜM gerekli intent'lerle
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ]
});

// Komutlar için collection
client.commands = new Collection();

// Komutları yükle
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Komut yüklendi: ${command.data.name}`);
        } else {
            console.log(`⚠️ ${file} komutu 'data' veya 'execute' özelliğine sahip değil`);
        }
    }
}

// Event'leri yükle
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.name) {
            // Eğer event once özelliği varsa client.once kullan, yoksa client.on
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            console.log(`✅ Event yüklendi: ${event.name}`);
        }
    }
}

// Bot hazır olduğunda
client.once(Events.ClientReady, async () => {
    console.log(`✅ Bot aktif! ${client.user.tag} olarak giriş yapıldı.`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
    console.log(`📝 ${client.commands.size} komut yüklendi`);

    // Bot durumunu ayarla
    client.user.setActivity('KY EKİBİNİN HİZMETİNDEDİR.', { type: 0 }); // 0 = PLAYING

    // Otomatik ses kanalına katıl
    const autoJoinChannelId = process.env.AUTO_JOIN_VOICE_CHANNEL;
    if (autoJoinChannelId) {
        try {
            const { joinVoiceChannel } = require('@discordjs/voice');

            // Kanalı bul
            const channel = await client.channels.fetch(autoJoinChannelId);

            if (channel && channel.isVoiceBased()) {
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: true, // Sağırlaştırılmış
                    selfMute: false
                });

                console.log(`🔊 Otomatik ses kanalına katıldı: ${channel.name}`);
            } else {
                console.warn('⚠️ Belirtilen ses kanalı bulunamadı veya ses kanalı değil');
            }
        } catch (error) {
            console.error('❌ Otomatik ses kanalına katılma hatası:', error);
        }
    }
});

// Slash komut etkileşimleri
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ ${interaction.commandName} komutu bulunamadı`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ ${interaction.commandName} komutu çalıştırılırken hata:`, error);

        const errorMessage = {
            content: '❌ Bu komutu çalıştırırken bir hata oluştu!',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Hata yönetimi
client.on('error', (error) => {
    console.error('❌ Bot hatası:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ İşlenmeyen hata:', error);
});

// Bot'u başlat
client.login(process.env.DISCORD_TOKEN)
    .catch((error) => {
        console.error('❌ Bot giriş yapamadı:', error);
        process.exit(1);
    });
