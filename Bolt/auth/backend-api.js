/**
 * ArcadeX Backend API
 * Handles all communication with the local backend server (server.js).
 */

const API_BASE = 'http://localhost:3000/api';

class BackendAPI {

    /**
     * Send Webhook Embed
     * @param {string} webhookUrl 
     * @param {object} embedData 
     */
    static async sendEmbed(webhookUrl, embedData) {
        try {
            const res = await fetch(`${API_BASE}/send-embed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ webhookUrl, embed: embedData })
            });
            return await res.json();
        } catch (e) {
            console.error("API Error:", e);
            return { error: e.message };
        }
    }

    /**
     * Save Configuration (Automod, Leveling, etc)
     * @param {string} guildId 
     * @param {string} type (e.g. 'automod', 'levels')
     * @param {object} settings 
     */
    static async saveConfig(guildId, type, settings) {
        try {
            const res = await fetch(`${API_BASE}/save-config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, type, settings })
            });
            return await res.json();
        } catch (e) {
            return { error: e.message };
        }
    }

    /**
     * Music Controls
     */
    static async playMusic(guildId, query) {
        return this._post('/music/play', { guildId, query });
    }

    static async skipTrack(guildId) {
        return this._post('/music/skip', { guildId });
    }

    static async stopMusic(guildId) {
        return this._post('/music/stop', { guildId });
    }

    static async getQueue(guildId) {
        try {
            const res = await fetch(`${API_BASE}/music/queue/${guildId}`);
            return await res.json();
        } catch (e) {
            return { error: e.message };
        }
    }

    // Helper
    static async _post(endpoint, body) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) {
            console.error("API Error:", e);
            return { error: e.message };
        }
    }
}

// Global exposure
window.BackendAPI = BackendAPI;
