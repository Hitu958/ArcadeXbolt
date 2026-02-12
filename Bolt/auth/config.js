// ArcadeX Configuration
const CONFIG = {
    CLIENT_ID: '1218168431703097354',
    REDIRECT_URI: 'http://localhost:3000/callback.html',
    API_BASE: 'http://localhost:3000/api',
    DISCORD_API: 'https://discord.com/api/v10',
    OAUTH_URL: function () {
        const params = new URLSearchParams({
            client_id: this.CLIENT_ID,
            redirect_uri: this.REDIRECT_URI,
            response_type: 'code',
            scope: 'identify guilds'
        });
        return `https://discord.com/oauth2/authorize?${params.toString()}`;
    },
    BOT_INVITE: function () {
        return `https://discord.com/oauth2/authorize?client_id=${this.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;
    }
};
