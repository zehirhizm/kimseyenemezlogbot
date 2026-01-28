const express = require('express');
const app = express();
const PORT = 3000;

// Basit bir web sunucusu - Replit'in bot'u aktif tutması için
app.get('/', (req, res) => {
    res.send('Bot çalışıyor! 🤖');
});

app.get('/ping', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

function keepAlive() {
    app.listen(PORT, () => {
        console.log(`🌐 Keep-alive sunucusu ${PORT} portunda çalışıyor`);
    });
}

module.exports = keepAlive;
