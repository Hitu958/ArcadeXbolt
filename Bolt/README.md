# 🕹️ ArcadeX — Discord Bot Dashboard

A premium web dashboard for the ArcadeX Discord bot.

## Quick Start (No Node.js needed!)

```powershell
# Run from the ArcadeX-Web folder:
powershell -ExecutionPolicy Bypass -File server.ps1
```

Then open **http://localhost:8080** in your browser.

## Features
- 📦 **Embed Builder** — Live preview, fields, colors, images
- 🎨 **Welcome Card Builder** — Custom backgrounds, text, avatar styling
- 🛡️ **Auto Moderation** — Anti-spam, link filter, word filter, raid protection
- 🎵 **Music Dashboard** — Queue, playback controls, volume
- 💰 **Economy System** — Currency, daily rewards, gambling, shop, robbery
- 🏆 **Leveling & XP** — XP settings, role rewards, announcements
- 🎫 **Ticket System** — Categories, staff roles, transcripts, auto-close
- 🎁 **Giveaways** — Create/manage giveaways with requirements

## Setup Discord Login (Requires Node.js)

1. Install Node.js from https://nodejs.org (LTS)
2. Run `npm init -y && npm install express cors node-fetch` in this folder
3. Create a `backend.js` file (I'll build this once Node.js is installed)
4. Add `http://localhost:8080/callback.html` as a redirect URI in your Discord app settings

## File Structure
```
ArcadeX-Web/
├── index.html          # Landing page
├── dashboard.html      # Main dashboard
├── embed-builder.html  # Embed builder with live preview
├── welcome-builder.html# Welcome card builder
├── automod.html        # Automod configuration
├── music.html          # Music controls
├── economy.html        # Economy settings
├── leveling.html       # Leveling configuration
├── tickets.html        # Ticket system settings
├── giveaways.html      # Giveaway management
├── servers.html        # Server selector
├── callback.html       # OAuth callback handler
├── server.ps1          # PowerShell HTTP server
├── css/style.css       # Design system
├── js/config.js        # Configuration
├── js/auth.js          # Auth module
└── js/utils.js         # Utilities
```
