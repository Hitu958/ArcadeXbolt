const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const connectDB = require('./config/db');
const GuildConfig = require('./models/GuildConfig');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// 1. DISCORD LOGIN
app.post('/api/auth/callback', async (req, res) => {
    try {
        const { code } = req.body;

        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) {
            return res.status(400).json({ error: 'OAuth failed' });
        }

        const data = await response.json();

        // Fetch user data
        const userReq = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${data.access_token}` }
        });
        const user = await userReq.json();

        // Fetch guilds
        const guildsReq = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${data.access_token}` }
        });
        const guilds = await guildsReq.json();

        res.json({
            access_token: data.access_token,
            user,
            guilds: Array.isArray(guilds) ? guilds : [],
            premium: false
        });
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. SAVE CONFIG (Upsert & Security)
app.post('/api/save-config', async (req, res) => {
    const { guildId, type, settings } = req.body;

    try {
        // Find or Create Guild Config
        let config = await GuildConfig.findOne({ guildId });

        if (!config) {
            config = new GuildConfig({ guildId });
        }

        // SECURITY: Premium Logic Lock
        const isPremium = config.premiumStatus.isPremium;

        // Branding Check
        if (type === 'welcome' && settings.remove_branding === true) {
            if (!isPremium) {
                console.warn(`[Security] Blocked branding removal for non-premium guild ${guildId}`);
                settings.remove_branding = false; // Force overwrite
            }
        }

        // Music Shuffle Check (if settings included music)
        if (type === 'music' && settings.forceShuffle === false) {
            if (!isPremium) {
                settings.forceShuffle = true; // Force shuffle
            }
        }

        // Apply updates based on type
        if (type === 'welcome') {
            config.welcomeSettings = { ...config.welcomeSettings, ...settings };
        } else if (type === 'music') {
            config.musicSettings = { ...config.musicSettings, ...settings };
        } else if (type === 'automod') {
            config.autoMod = { ...config.autoMod, ...settings };
        } else if (type === 'economy') {
            config.economy = { ...config.economy, ...settings };
        }

        await config.save();
        console.log(`[DB] Saved config for guild ${guildId} (Type: ${type})`);
        res.json({ success: true, premium: isPremium });

    } catch (err) {
        console.error('Save Error:', err);
        res.status(500).json({ error: 'Database Write Failed' });
    }
});

// 3. GET CONFIG
app.get('/api/get-config/:guildId', async (req, res) => {
    try {
        const config = await GuildConfig.findOne({ guildId: req.params.guildId });
        if (!config) return res.json({}); // Return empty if not found

        // Transform mongoose doc to frontend expected format
        res.json({
            welcome: config.welcomeSettings,
            music: config.musicSettings,
            automod: config.autoMod,
            economy: config.economy,
            premium: config.premiumStatus
        });
    } catch (err) {
        console.error('Get Error:', err);
        res.status(500).json({ error: 'Database Read Failed' });
    }
});

// 4. SEND EMBED
app.post('/api/send-embed', async (req, res) => {
    const { webhookUrl, embed } = req.body;
    if (!webhookUrl) return res.status(400).json({ error: 'Missing webhook URL' });

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok || response.status === 204) {
            res.json({ success: true });
        } else {
            res.status(response.status).json({ error: 'Webhook failed' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 5. MUSIC API (With Queue & DB Integration)
app.post('/api/music/play', async (req, res) => {
    const { guildId, query } = req.body;

    // Check DB for premium
    const config = await GuildConfig.findOne({ guildId });
    const isPremium = config?.premiumStatus?.isPremium || false;

    console.log(`[Music] Guild ${guildId} Play: ${query} (Premium: ${isPremium})`);

    // In a real bot, we'd push to a queue array in DB or Redis
    // If NOT premium, ensure shuffle is active

    res.json({ success: true, message: `Added ${query} to queue` });
});

app.post('/api/music/skip', (req, res) => {
    const { guildId } = req.body;
    console.log(`[Music] Guild ${guildId} skipped track`);
    res.json({ success: true, message: 'Skipped track' });
});

app.post('/api/music/stop', (req, res) => {
    const { guildId } = req.body;
    console.log(`[Music] Guild ${guildId} stopped playback`);
    res.json({ success: true, message: 'Stopped playback' });
});

app.get('/api/music/queue/:guildId', (req, res) => {
    res.json({
        current: { title: "Never Gonna Give You Up", artist: "Rick Astley", duration: 213 },
        queue: [
            { title: "Sandstorm", artist: "Darude", duration: 180 },
            { title: "All Star", artist: "Smash Mouth", duration: 200 }
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
