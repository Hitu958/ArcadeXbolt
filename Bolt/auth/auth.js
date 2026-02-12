// ArcadeX Auth Module
const Auth = {
    getUser() {
        const data = localStorage.getItem('arcadex_user');
        return data ? JSON.parse(data) : null;
    },
    getToken() {
        return localStorage.getItem('arcadex_token');
    },
    setSession(token, user) {
        localStorage.setItem('arcadex_token', token);
        localStorage.setItem('arcadex_user', JSON.stringify(user));
    },
    logout() {
        localStorage.removeItem('arcadex_token');
        localStorage.removeItem('arcadex_user');
        localStorage.removeItem('arcadex_guilds');
        window.location.href = 'index.html';
    },
    isLoggedIn() {
        return !!this.getToken() && !!this.getUser();
    },
    login() {
        window.location.href = CONFIG.OAUTH_URL();
    },
    getAvatarURL(user) {
        if (!user) return '';
        if (user.avatar) {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        }
        const idx = user.discriminator === '0'
            ? (BigInt(user.id) >> 22n) % 6n
            : parseInt(user.discriminator) % 5;
        return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    },
    async fetchUserFromCode(code) {
        // Exchange code for token via our backend
        const res = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();
        this.setSession(data.access_token, data.user);

        // Sync Premium Status from Backend
        if (data.premium !== undefined) {
            localStorage.setItem('arcadex_premium', data.premium ? 'true' : 'false');
        }

        if (data.guilds) {
            localStorage.setItem('arcadex_guilds', JSON.stringify(data.guilds));
        }
        return data.user;
    },
    getGuilds() {
        const data = localStorage.getItem('arcadex_guilds');
        return data ? JSON.parse(data) : [];
    },
    async saveConfig(guildId, type, settings) {
        const res = await fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guildId, type, settings })
        });
        return await res.json();
    }
};
