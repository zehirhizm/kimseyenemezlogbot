# Kimse Yenemez Log Bot 🤖

Discord sunucunuz için kapsamlı log sistemi - Modern embed panellerle tüm aktiviteleri kaydedin!

## 🚀 Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Environment dosyasını ayarla
- `.env.example` dosyasını `.env` olarak kopyala
- Discord bot tokenini ve client ID'yi ekle

**`.env` dosyası örneği:**
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

### 3. Slash komutları Discord'a kaydet
```bash
npm run deploy
```

### 4. Bot'u çalıştır
```bash
npm start
```

### 5. Log kanalını ayarla
Sunucunuzda `/log-kanal-ayarla #kanal-adı` komutunu kullanın

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

## 🔧 Bot Token ve Kurulum

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine git
2. "New Application" butonuna tıkla
3. Bot'a bir isim ver
4. Sol menüden "Bot" sekmesine git
5. "Add Bot" butonuna tıkla
6. "Reset Token" ile token'ı al ve `.env` dosyasına ekle
7. "OAuth2" > "General" sekmesinden Application ID'yi kopyala ve `.env` dosyasına ekle
8. **ÖNEMLİ:** "Bot" sekmesinden "Privileged Gateway Intents" bölümünden **TÜM** izinleri aktifleştir:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

## 📁 Proje Yapısı

```
kimseyenemezlogbot/
├── commands/                    # Slash komutlar
│   ├── log-kanal-ayarla.js     # Log kanalı ayarlama
│   └── log-test.js             # Log sistemi test
├── events/                      # Event handler'lar
│   ├── messageDelete.js        # Mesaj silme logu
│   ├── messageUpdate.js        # Mesaj düzenleme logu
│   ├── guildMemberAdd.js       # Üye katılma logu
│   ├── guildMemberRemove.js    # Üye ayrılma logu
│   ├── guildMemberUpdate.js    # Rol/nickname/timeout logu
│   ├── guildBanAdd.js          # Ban logu
│   ├── guildBanRemove.js       # Ban kaldırma logu
│   ├── voiceStateUpdate.js     # Ses kanalı logu
│   ├── channelCreate.js        # Kanal oluşturma logu
│   ├── channelDelete.js        # Kanal silme logu
│   ├── roleCreate.js           # Rol oluşturma logu
│   └── roleDelete.js           # Rol silme logu
├── utils/                       # Yardımcı dosyalar
│   ├── embedBuilder.js         # Modern embed şablonları
│   ├── configManager.js        # Config yönetimi
│   └── logger.js               # Log gönderme helper
├── index.js                     # Ana bot dosyası
├── deploy-commands.js           # Slash komut deploy scripti
├── config.json                  # Sunucu ayarları (otomatik oluşur)
├── package.json
├── .env                         # Environment değişkenleri
└── README.md

## ✨ Özellikler

### 📝 Mesaj Logları
- Silinen mesajlar (içerik, kim sildi, hangi kanal)
- Düzenlenen mesajlar (eski → yeni karşılaştırma)

### 👥 Üye Logları
- Sunucuya katılma (hesap yaşı, üye sayısı)
- Sunucudan ayrılma (roller)
- Ban/Unban (moderatör, sebep)
- Rol değişiklikleri (eklenen/çıkarılan roller)
- Nickname değişiklikleri (eski → yeni)
- Timeout verme/kaldırma (moderatör, süre)

### 🔊 Ses Kanalı Logları
- Ses kanalına giriş/çıkış (hangi kanaldan → hangi kanala)
- **Üye çekme detayları** (kim kimi hangi odadan hangi odaya çekti)
- Mikrofon açma/kapama
- Kulaklık açma/kapama
- Kamera açma/kapama
- Ekran paylaşımı başlatma/durdurma

### 📢 Kanal Logları
- Kanal oluşturma
- Kanal silme

### 🎭 Rol Logları
- Rol oluşturma
- Rol silme

### 🎨 Modern Tasarım
- Renkli kategorize edilmiş embedler
- Her log türü için özel renk
- Timestamp bilgisi
- Kullanıcı avatarları
- Detaylı bilgi alanları

## 🎮 Komutlar

| Komut | Açıklama | Yetki |
|-------|----------|-------|
| `/log-kanal-ayarla #kanal` | Log mesajlarının gönderileceği kanalı ayarlar | Yönetici |
| `/log-test` | Log sistemini test eder | Herkes |

## 🎯 Kullanım

1. Bot'u sunucunuza ekleyin
2. `/log-kanal-ayarla #log-kanalı` komutu ile log kanalını ayarlayın
3. `/log-test` ile sistemi test edin
4. Artık tüm aktiviteler otomatik olarak loglanacak!

## 🔐 Güvenlik

- ✅ Log kanalı sadece yöneticiler tarafından ayarlanabilir
- ✅ Config dosyası `.gitignore`'da
- ✅ `.env` dosyası asla Git'e eklenmez
- ✅ Hata yönetimi - bot çökmez

## 📊 Log Renk Kodları

- 🔴 Kırmızı: Mesaj silme, kanal silme, ban
- 🟢 Yeşil: Üye katılma, ses kanalına giriş
- 🟠 Turuncu: Mesaj düzenleme, timeout
- 🔵 Mavi: Nickname değişikliği, kanal değiştirme
- 🟣 Mor: Rol değişiklikleri
- 🟡 Sarı: Üye çekme (move)

## 🤝 Katkıda Bulunma

Yarın daha fazla özellik eklenecek! 🚀
