require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// Komut dosyalarını oku
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ ${command.data.name} komutu yüklendi`);
    } else {
        console.log(`⚠️ ${file} komutu 'data' veya 'execute' özelliğine sahip değil`);
    }
}

// Discord API'ye komutları kaydet
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 ${commands.length} slash komutu Discord'a kaydediliyor...`);

        // Global komutlar için
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ ${data.length} slash komutu başarıyla kaydedildi!`);
        console.log('📝 Kayıtlı komutlar:', data.map(cmd => cmd.name).join(', '));
    } catch (error) {
        console.error('❌ Komutlar kaydedilirken hata:', error);
    }
})();
